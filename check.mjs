import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://rbwimpvcbklqodqsfcvf.supabase.co', 'sb_publishable_eI-NNuflW0qxNbTgck71uQ_cCDWfe8o');
async function check() {
  const { data } = await supabase.from('site_settings').select('hero_title, hero_badge');
  console.log('Database returns:', data);
}
check();
