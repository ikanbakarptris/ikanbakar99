import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aaaafvtvofunzelublak.supabase.co';
const ANON_KEY_PUBLISHABLE = 'sb_publishable_ckYtrYIVvHQXzG_12UushA_7ADMdQu7';

const supabase = createClient(SUPABASE_URL, ANON_KEY_PUBLISHABLE);

async function run() {
  const { data, error } = await supabase.auth.signUp({
    email: 'muhammad.zebbie@gmail.com',
    password: 'Sunnah725'
  });
  
  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('Signup success:', data.user?.identities?.length ? 'Account created' : 'Already exists or fake user');
    console.log('User confirmed at:', data.user?.email_confirmed_at);
    
    // Test login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'muhammad.zebbie@gmail.com',
      password: 'Sunnah725'
    });
    
    if (loginError) {
      console.log('Login test failed:', loginError.message);
    } else {
      console.log('Login test succeeded! User is fully active.');
    }
  }
}
run();
