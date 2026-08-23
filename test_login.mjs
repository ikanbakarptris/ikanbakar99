import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rbwimpvcbklqodqsfcvf.supabase.co';
const ANON_KEY_PUBLISHABLE = 'sb_publishable_eI-NNuflW0qxNbTgck71uQ_cCDWfe8o';
const ANON_KEY_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJid2ltcHZjYmtscW9kcXNmY3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MjM5MDgsImV4cCI6MjEwMjk5OTkwOH0.MYwhGV2dVsKZFiBHSQ_OBH7QF0tIH8J0Zb7l8Hru9jo';

async function testLogin(key, name) {
  console.log('Testing with ' + name);
  const supabase = createClient(SUPABASE_URL, key);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'muhammad.zebbie@gmail.com',
    password: 'Sunnah725'
  });
  console.log('Result:', error ? error.message : 'Success!');
}

async function run() {
  await testLogin(ANON_KEY_PUBLISHABLE, 'Publishable Key');
  await testLogin(ANON_KEY_JWT, 'JWT Anon Key');
}
run();
