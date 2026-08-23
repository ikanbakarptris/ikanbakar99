import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rbwimpvcbklqodqsfcvf.supabase.co',
  'sb_publishable_eI-NNuflW0qxNbTgck71uQ_cCDWfe8o'
);

async function run() {
  const { data, error } = await supabase.auth.signUp({
    email: 'muhammad.zebbie@gmail.com',
    password: 'Sunnah725'
  });
  
  if (error) {
    console.error('Error signing up:', error);
  } else {
    console.log('Signup success:', data.user?.identities?.length ? 'Account created' : 'Already exists or fake user');
    console.log('User confirmed at:', data.user?.email_confirmed_at);
  }
}
run();
