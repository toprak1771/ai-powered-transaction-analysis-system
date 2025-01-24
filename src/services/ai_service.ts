import OpenAI from "openai";
import { Transaction,ResultPatternDetection } from "src/types/ai.type";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { CreateNormalizationAi } from "src/normalization/entities/normalization.entity";

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("OPEN_AI_KEY");
    if (!apiKey) {
      throw new Error(
        "OpenAI API key is not defined in the environment variables.",
      );
    }
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async normalizeTransaction(transaction: Transaction):Promise<CreateNormalizationAi> {
    const prompt = `
          Normalize the following financial transaction and provide additional metadata:
      Description: ${transaction.description}
      Amount: ${transaction.amount}
      Date: ${transaction.date}
  
      Respond with a JSON object in this format:
      {
        "merchant": "<merchant name>",
        "category": "<category>",
        "sub_category": "<sub_category>",
        "confidence": <confidence>,
        "is_subscription": <true/false>,
        "flags": ["<flag1>", "<flag2>"]
      }
  
      Example flags include: "online_purchase", "marketplace", "subscription", "digital_service", "transportation".
      Ensure the response is a valid JSON object.
      `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0,
      });

      console.log("response1:", typeof JSON.parse(response.choices[0].message.content))
      return JSON.parse(response.choices[0].message.content);
    } catch (error: any) {
      // if (error.code === 'insufficient_quota') {
      //   console.error('Quota exceeded. Please check your billing details.');
      //   throw new Error('API kullanım kotası aşıldı. Lütfen fatura detaylarınızı kontrol edin.');
      // }
      //throw error;
      console.log("error:",error);
    }
  }

  async detectPatternWithAI(transactions:any) {
    console.log("transactions:",transactions);
    const patterns:ResultPatternDetection[] = [];
    
    for (const transaction of transactions) {
      const prompt = `
      Analyze the transaction and determine if it is recurring or one-time:
      Description: ${transaction.description}
      Amount: ${transaction.amount}
      Date: ${transaction.date}
      Respond with: { "merchant":"<merchant>", "type": "<type>", "frequency": "<frequency>", "confidence": <confidence>, "next_excepted":"<next_excepted>" }
      `;
  
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0,
      });
      console.log("response:",response.choices[0].message);
      const result:ResultPatternDetection = JSON.parse(response.choices[0].message.content);
      result.confidence = result.confidence / 100;
      console.log("result:",result);
      if (result.type === "subscription" && result.frequency === "recurring") {
        patterns.push({
          ...result,
        });
      } else {
        delete result.next_excepted;
        patterns.push({
          ...result
        })
      }
    }
    console.log("patterns:",patterns);
    return patterns;
  }
}
