import OpenAI from "openai";
import { Transaction, ResultPatternDetection } from "src/types/ai.type";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { CreateNormalizationAi,CreateNormalizationAiwithDesc } from "src/normalization/entities/normalization.entity";

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

  async normalizeTransaction(
    transaction: Transaction,
  ): Promise<CreateNormalizationAi> {
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

      console.log(
        "response1:",
        typeof JSON.parse(response.choices[0].message.content),
      );
      return JSON.parse(response.choices[0].message.content);
    } catch (error: any) {
      // if (error.code === 'insufficient_quota') {
      //   console.error('Quota exceeded. Please check your billing details.');
      //   throw new Error('API kullanım kotası aşıldı. Lütfen fatura detaylarınızı kontrol edin.');
      // }
      //throw error;
      console.log("error:", error);
    }
  }

  // async normalizeTransactionArray(
  //   transactions: Transaction[],
  // ): Promise<CreateNormalizationAi[]> {
  //   console.log("transactions:",transactions);
  //   const prompt = `
  //     Normalize the following financial transactions and provide additional metadata:
  //     ${transactions
  //       .map(
  //         (transaction) => `
  //       Description: ${transaction.description}
  //       Amount: ${transaction.amount}
  //       Date: ${transaction.date}`,
  //       )
  //       .join("\n")}
  
  //     For each transaction:
  //     1. Ensure each merchant appears only once in the final response. If the same merchant appears in multiple transactions, only return it once.
  //     2. Analyze the description and extract the merchant's brand name.
  //     3. Classify the transaction with the appropriate category and sub-category.
  //     4. Provide flags such as "online_purchase", "marketplace", "subscription", "digital_service", "transportation".
  //     5. Return the response as a JSON array with each merchant only included once.
  
  //     Example response format:
  //     [
  //       {
  //         "merchant": "<merchant name>",
  //         "category": "<category>",
  //         "sub_category": "<sub_category>",
  //         "confidence": <confidence>,
  //         "is_subscription": <true/false>,
  //         "flags": ["<flag1>", "<flag2>"]
  //       },
  //       ...
  //     ]
      
  //     Make sure to handle any duplicate merchants, returning only one entry for each merchant.
  //   `;
  
  //   try {
  //     const response = await this.openai.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: [{ role: "user", content: prompt }],
  //       max_tokens: 1000,
  //       temperature: 0,
  //     });
  
  //     // Parse the AI response and return it directly
      
  //     const aiResponse = JSON.parse(response.choices[0].message.content);
      
      
  //     return aiResponse;
  //   } catch (error: any) {
  //     console.log("error:", error);
  //     throw error; // Rethrow the error after logging
  //   }
  // }

  // async detectPatternWithAI(transactions:any) {
  //   console.log("transactions:",transactions);
  //   const patterns:ResultPatternDetection[] = [];

  //   for (const transaction of transactions) {
  //     const prompt = `
  //     Analyze the transaction and determine if it is recurring or one-time:
  //     Description: ${transaction.description}
  //     Amount: ${transaction.amount}
  //     Date: ${transaction.date}
  //     Respond with: { "merchant":"<merchant>", "type": "<type>", "frequency": "<frequency>", "confidence": <confidence>, "next_excepted":"<next_excepted>" }
  //     `;

  //     const response = await this.openai.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: [{ role: "user", content: prompt }],
  //       max_tokens: 1000,
  //       temperature: 0,
  //     });
  //     console.log("response:",response.choices[0].message);
  //     const result:ResultPatternDetection = JSON.parse(response.choices[0].message.content);
  //     result.confidence = result.confidence / 100;
  //     console.log("result:",result);
  //     if (result.type === "subscription" && result.frequency === "recurring") {
  //       patterns.push({
  //         ...result,
  //       });
  //     } else {
  //       delete result.next_excepted;
  //       patterns.push({
  //         ...result
  //       })
  //     }
  //   }
  //   console.log("patterns:",patterns);
  //   return patterns;
  // }

  // async detectPatternWithAI(transactions: Transaction[]): Promise<any[]> {
  //   console.log("transactions:", transactions);
  
  //   const prompt = `
  //     Normalize the following financial transactions based on the description and classify each one:
      
  //     Transactions: 
  //     ${transactions
  //       .map(
  //         (transaction) => `
  //       Description: ${transaction.description}
  //       Amount: ${transaction.amount}
  //       Date: ${transaction.date}`,
  //       )
  //       .join("\n")}
  
  //     For each transaction:
  //     1. Analyze the description and extract the merchant's brand name, not just the description.
  //     2. Analyze the transaction date(s) and determine if there are any recurring patterns (e.g., transactions occurring on the same day of the week, same day of the month, or at regular intervals).
  //     3. Classify the merchant based on the description.
  //     4. Determine if the transaction is a "subscription", "recurring", or "one-time".
  //        - If the merchant is **Netflix** or **Spotify**, classify it as a **"subscription"** with frequency **"monthly"** and detail **"payment on the 1st/15th of the month"**. Use the \`amount\` directly from the provided data for these transactions.
  //        - If the transaction is recurring but not from **Netflix** or **Spotify**, classify it as **"recurring"**:
  //          - Set the frequency to **"weekly"** if transactions occur every 1-7 days.
  //          - Set the frequency to **"monthly"** if transactions occur every 15-30 days.
  //          - Calculate the average \`amount\` for merchants like **Uber** and **Starbucks** if multiple recurring payments are present.
  //          - Set the details based on the frequency, e.g., **"2-3 times per week"** if the interval is between 2-3 times per week.
  //     5. If the transaction has no recurring pattern or happens at irregular intervals, classify it as **"one-time"**.
  //     6. Do not repeat merchants with the same brand name.
  //     7. Provide the response as a **JSON array** with each transaction as an object in the following format:
      
  //     [ 
  //       {
  //         "merchant": "<merchant>", // Extracted brand name from the description
  //         "amount": <amount>, // Amount of the transaction
  //         "type": "<type>", // "subscription", "recurring", "one-time"
  //         "frequency": "<frequency>", // "weekly", "monthly", "2-3 times per week", "one-time"
  //         "confidence": <confidence>, // Estimate confidence level
  //         "next_expected": "<nextExpected>", // Calculate next expected date based on the average transaction intervals
  //         "detail": "<detail>" // Explain the frequency and details of the recurring pattern
  //       },
  //       ...
  //     ]
  //   `;
  
  //   try {
  //     const response = await this.openai.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: [{ role: "user", content: prompt }],
  //       max_tokens: 1500,
  //       temperature: 0.7,
  //     });
  
  //     const aiResponse = response.choices[0]?.message?.content;
  
  //     if (!aiResponse) {
  //       console.error("AI response is empty or undefined.");
  //       return [];
  //     }
  
  //     try {
  //       const parsedResponse = JSON.parse(aiResponse);
  //       if (Array.isArray(parsedResponse)) {
  //         return parsedResponse; // Return the parsed JSON array
  //       } else {
  //         console.error("Parsed response is not an array:", parsedResponse);
  //         return [];
  //       }
  //     } catch (jsonError) {
  //       console.error("Error parsing AI response as JSON:", jsonError, "Response:", aiResponse);
  //       return [];
  //     }
  //   } catch (error) {
  //     console.error("Error during AI prompt execution:", error);
  //     return [];
  //   }
  // }

  async normalizeTransactionArray(
    transactions: Transaction[],
  ): Promise<CreateNormalizationAiwithDesc[]> {
    
  
    const prompt = `
      Normalize the following financial transactions and provide additional metadata:
      ${transactions
        .map(
          (transaction) => `
        Description: ${transaction.description}
        Amount: ${transaction.amount}
        Date: ${transaction.date}`,
        )
        .join("\n")}
  
      For each transaction:
      1. Ensure each merchant appears only once in the final response. If the same merchant appears in multiple transactions, only return it once.
      2. Analyze the description and extract the merchant's brand name.
      3. Include the **original description** field in the final response.
      4. Classify the transaction with the appropriate category and sub-category.
      5. Provide flags such as "online_purchase", "marketplace", "subscription", "digital_service", "transportation".
      6. Return the response as a JSON array with each merchant only included once.
  
      Example response format:
      [
        {
          "merchant": "<merchant name>",
          "description": "<original transaction description>",
          "category": "<category>",
          "sub_category": "<sub_category>",
          "confidence": <confidence>,
          "is_subscription": <true/false>,
          "flags": ["<flag1>", "<flag2>"]
        },
        ...
      ]
      
      Make sure to handle any duplicate merchants, returning only one entry for each merchant while keeping the original transaction description.
    `;
  
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0,
      });
  
      // Parse AI response and return
      const aiResponse = JSON.parse(response.choices[0].message.content);
  
      return aiResponse;
    } catch (error: any) {
      console.log("error:", error);
      throw error; // Rethrow the error after logging
    }
  }
  
  
  async detectPatternWithAI(transactions: Transaction[]): Promise<ResultPatternDetection[]> {
    
  
    const prompt = `
      Normalize the following financial transactions based on the description and classify each one:
      
      Transactions: 
      ${transactions
        .map(
          (transaction) => `
        Description: ${transaction.description}
        Amount: ${transaction.amount}
        Date: ${transaction.date}`  
        )
        .join("\n")}
  
      For each transaction:
      1. Analyze the description and extract the merchant's brand name, not just the description.
      2. Analyze the transaction date(s) and determine if there are any recurring patterns (e.g., transactions occurring on the same day of the week, same day of the month, or at regular intervals).
      3. Classify the merchant based on the description.
      4. Determine if the transaction is a "subscription", "recurring", or "one-time".
         - If the merchant is **Netflix** or **Spotify**, classify it as a **"subscription"** with frequency **"monthly"** and detail **"payment on the 1st/15th of the month"**. Use the \`amount\` directly from the provided data for these transactions.
         - If the transaction is recurring but not from **Netflix** or **Spotify**, classify it as **"recurring"**:
           - Set the frequency to **"weekly"** if transactions occur every 1-7 days.
           - Set the frequency to **"monthly"** if transactions occur every 15-30 days.
           - Calculate the average \`amount\` for merchants like **Uber** and **Starbucks** if multiple recurring payments are present.
           - Set the details based on the frequency, e.g., **"2-3 times per week"** if the interval is between 2-3 times per week.
      5. If the transaction has no recurring pattern or happens at irregular intervals, classify it as **"one-time"**.
      6. If the same merchant appears more than once in the dataset, classify it as "recurring" unless it is explicitly a subscription.
      7. Do not repeat merchants with the same brand name.
      8. Provide the response as a **JSON array** with each transaction as an object in the following format:
  
      [ 
        {
          "merchant": "<merchant>", // Extracted brand name from the description
          "amount": <amount>, // Amount of the transaction
          "type": "<type>", // "subscription", "recurring", "one-time"
          "frequency": "<frequency>", // "weekly", "monthly", "2-3 times per week", "one-time"
          "confidence": <confidence>, // Estimate confidence level
          "next_expected": "<nextExpected>", // Calculate next expected date based on the average transaction intervals
          "detail": "<detail>" // Explain the frequency and details of the recurring pattern
        },
        ...
      ]
    `;
  
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      });
  
      const aiResponse = response.choices[0]?.message?.content;
  
      if (!aiResponse) {
        console.error("AI response is empty or undefined.");
        return [];
      }
  
      try {
        const parsedResponse = JSON.parse(aiResponse);
        if (Array.isArray(parsedResponse)) {
          return parsedResponse; // Return the parsed JSON array
        } else {
          console.error("Parsed response is not an array:", parsedResponse);
          return [];
        }
      } catch (jsonError) {
        console.error("Error parsing AI response as JSON:", jsonError, "Response:", aiResponse);
        return [];
      }
    } catch (error) {
      console.error("Error during AI prompt execution:", error);
      return [];
    }
  }
  
}
