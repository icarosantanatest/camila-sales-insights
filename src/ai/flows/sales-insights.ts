// Sales Insights flow
'use server';
/**
 * @fileOverview An AI agent that analyzes Hotmart sales data, summarizes key trends, and suggests actionable insights.
 *
 * - analyzeSalesInsights - A function that handles the sales data analysis process.
 * - AnalyzeSalesInsightsInput - The input type for the analyzeSalesInsights function.
 * - AnalyzeSalesInsightsOutput - The return type for the analyzeSalesInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSalesInsightsInputSchema = z.object({
  salesData: z.string().describe('The Hotmart sales data in JSON format.'),
});
export type AnalyzeSalesInsightsInput = z.infer<typeof AnalyzeSalesInsightsInputSchema>;

const AnalyzeSalesInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of key sales trends.'),
  insights: z.string().describe('Actionable insights to improve sales performance.'),
  potentialIssues: z.string().describe('Potential issues identified in the sales data.'),
  futureSalesPatterns: z.string().describe('Predicted future sales patterns based on the data.'),
});
export type AnalyzeSalesInsightsOutput = z.infer<typeof AnalyzeSalesInsightsOutputSchema>;

export async function analyzeSalesInsights(input: AnalyzeSalesInsightsInput): Promise<AnalyzeSalesInsightsOutput> {
  return analyzeSalesInsightsFlow(input);
}

const analyzeSalesInsightsPrompt = ai.definePrompt({
  name: 'analyzeSalesInsightsPrompt',
  input: {schema: AnalyzeSalesInsightsInputSchema},
  output: {schema: AnalyzeSalesInsightsOutputSchema},
  prompt: `You are a sales data analysis expert. Analyze the following Hotmart sales data and provide a summary of key trends, actionable insights, potential issues, and predicted future sales patterns.

Sales Data: {{{salesData}}}

Summary of Key Trends:
Insights for Sales Improvement:
Potential Issues:
Predicted Future Sales Patterns: `,
});

const analyzeSalesInsightsFlow = ai.defineFlow(
  {
    name: 'analyzeSalesInsightsFlow',
    inputSchema: AnalyzeSalesInsightsInputSchema,
    outputSchema: AnalyzeSalesInsightsOutputSchema,
  },
  async input => {
    const {output} = await analyzeSalesInsightsPrompt(input);
    return output!;
  }
);
