import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rbwimpvcbklqodqsfcvf.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJid2ltcHZjYmtscW9kcXNmY3ZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQyMzkwOCwiZXhwIjoyMTAyOTk5OTA4fQ._8xoDM8PqIjCpcfvjrkXndR_xT7CHf5qrCzOSIhpWz8';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const email = 'muhammad.zebbie@gmail.com';
  const password = 'Sunnah725';
  
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  const user = users?.users.find(u => u.email === email);
  
  if (user) {
    console.log('User found, confirming and setting password...');
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password, email_confirm: true }
    );
    console.log('Update result:', updateError || 'Success!');
  } else {
    console.log('User not found.');
  }
}
run();
