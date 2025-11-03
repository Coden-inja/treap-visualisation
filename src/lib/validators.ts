import { z } from 'zod';

// Validation schemas for data structure inputs
export const nodeValueSchema = z.number()
  .int('Value must be an integer')
  .min(-1000, 'Value must be at least -1000')
  .max(1000, 'Value must be at most 1000')
  .refine((val) => !isNaN(val) && isFinite(val), 'Value must be a valid number');

export const positionSchema = z.number()
  .int('Position must be an integer')
  .min(0, 'Position must be non-negative')
  .refine((val) => !isNaN(val) && isFinite(val), 'Position must be a valid number');

export const nodeLabelSchema = z.string()
  .max(50, 'Label must be less than 50 characters')
  .regex(/^[a-zA-Z0-9\s\-_]*$/, 'Label contains invalid characters');

export const edgeWeightSchema = z.number()
  .min(-10000, 'Weight must be at least -10000')
  .max(10000, 'Weight must be at most 10000')
  .refine((val) => !isNaN(val) && isFinite(val), 'Weight must be a valid number');

// Color validation for CSS safety
export const colorValueSchema = z.string()
  .regex(
    /^(#[0-9a-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|var\(|[a-z]+)$/i,
    'Invalid color format'
  );

export function validateNodeValue(input: string): { success: boolean; value?: number; error?: string } {
  const parsed = Number(input);
  const result = nodeValueSchema.safeParse(parsed);
  
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }
  
  return { success: true, value: result.data };
}

export function validatePosition(input: string): { success: boolean; value?: number; error?: string } {
  const parsed = Number(input);
  const result = positionSchema.safeParse(parsed);
  
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }
  
  return { success: true, value: result.data };
}

export function validateNodeLabel(input: string): { success: boolean; value?: string; error?: string } {
  const result = nodeLabelSchema.safeParse(input);
  
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }
  
  return { success: true, value: result.data };
}

export function validateEdgeWeight(input: string): { success: boolean; value?: number; error?: string } {
  const parsed = Number(input);
  const result = edgeWeightSchema.safeParse(parsed);
  
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }
  
  return { success: true, value: result.data };
}

export function isValidColor(color: string): boolean {
  return colorValueSchema.safeParse(color).success;
}
