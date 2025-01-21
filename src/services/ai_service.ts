import OpenAI from "openai";
import { Transaction } from "src/types/ai.type";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

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

  async normalizeTransaction(transaction: Transaction) {
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
      console.log("response:",response);
      console.log("response:", response.choices[0].message)
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
    const patterns:any = [];
  
    for (const transaction of transactions) {
      const prompt = `
      Analyze the transaction and determine if it is recurring or one-time:
      Description: ${transaction.description}
      Amount: ${transaction.amount}
      Date: ${transaction.date}
      Respond with: { "type": "<type>", "frequency": "<frequency>", "confidence": <confidence> }
      `;
  
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0,
      });
      console.log("response:",response.choices[0].message);
      const result = JSON.parse(typeof response.choices[0].message === 'string' ? response.choices[0].message : "{}");
      console.log("result:",result);
      if (result.type === "recurring") {
        patterns.push({
          ...result,
          next_expected: new Date(new Date(transaction.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Örnek: aylık düzen
        });
      }
    }
    console.log("patterns:",patterns);
    return patterns;
  }
}
