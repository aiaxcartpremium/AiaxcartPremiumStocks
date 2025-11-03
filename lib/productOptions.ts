// lib/productOptions.ts
import { supabase } from '@/lib/supabaseClient';

export type ProductOption = {
  value: string;      // product key (e.g., 'netflix')
  label: string;      // 'Netflix'
  category_key: string;   // 'entertainment'
  category_label: string; // 'Entertainment'
};

export async function fetchProductOptions(): Promise<ProductOption[]> {
  const { data, error } = await supabase
    .from('v_product_catalog') // view we created in the SQL bundle
    .select('key,label,category,category_label')
    .order('category_label', { ascending: true })
    .order('label', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    value: r.key,
    label: r.label,
    category_key: r.category,
    category_label: r.category_label
  }));
}

// fixed term list for the owner form (7d,14d,1..12 months)
export const TERM_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '1 month' },
  { value: '60', label: '2 months' },
  { value: '90', label: '3 months' },
  { value: '120', label: '4 months' },
  { value: '150', label: '5 months' },
  { value: '180', label: '6 months' },
  { value: '210', label: '7 months' },
  { value: '240', label: '8 months' },
  { value: '270', label: '9 months' },
  { value: '300', label: '10 months' },
  { value: '330', label: '11 months' },
  { value: '360', label: '12 months' }
];

export const ACCOUNT_TYPES = [
  { value: 'shared_profile',  label: 'Shared profile'  },
  { value: 'solo_profile',    label: 'Solo profile'    },
  { value: 'shared_account',  label: 'Shared account'  },
  { value: 'solo_account',    label: 'Solo account'    },
];