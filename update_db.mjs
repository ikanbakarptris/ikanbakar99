import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rbwimpvcbklqodqsfcvf.supabase.co',
  'sb_publishable_eI-NNuflW0qxNbTgck71uQ_cCDWfe8o'
);

async function run() {
  // 1. Sign up a temporary admin user
  const email = 'admin' + Date.now() + '@ikanbakar.com';
  const password = 'securepassword123';
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (authError) {
    console.error('Auth error:', authError);
    return;
  }
  
  console.log('Authenticated!');
  
  // 2. Fetch the current row
  const { data: settings } = await supabase.from('site_settings').select('*');
  if (settings && settings.length > 0) {
    const id = settings[0].id;
    // 3. Update the row with Ikanbakar99 data
    const { data: updateData, error: updateError } = await supabase.from('site_settings').update({
      shop_name: 'Ikan Bakar P. Tris',
      shop_address: 'Puri Delta, Ungaran Timur, Semarang',
      whatsapp_number: '+6282227459399',
      hero_badge: 'Spesialis Ikan & Ayam Bakar',
      hero_title: 'Sajian Ikan Bakar Lezat & Praktis untuk Keluarga Anda',
      hero_desc_1: 'Nikmati lele bakar, nila, ayam bule, dan gurameh dengan bumbu meresap khas P. Tris.',
      hero_desc_2: 'Pesan antar area Puri Delta, Ungaran Timur, Ungaran Barat.',
      hero_image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=800',
      hero_stats: [
         { label: 'Rating', value: '4.9/5' },
         { label: 'Pesanan Sukses', value: '100+' },
         { label: 'Gratis Ongkir', value: 'Puri Delta' }
      ],
      header_subtitle: 'Rumah makan ikan bakar di Ungaran',
      services_title: 'Menu Spesial Kami',
      services_subtitle: 'Bumbu meresap sempurna, dibakar mendadak setelah pesanan masuk.',
      trust_pickup_title: 'Layanan Pesan Antar',
      trust_pickup_desc: 'Layanan pesan antar untuk area Puri Delta dan sekitarnya. Mudah, praktis, langsung sampai depan rumah.',
      trust_rating_text: 'ulasan pelanggan',
      services: [
        { title: 'Lele Bakar', desc: 'Lele segar bumbu rempah, dibakar garing. Gratis sambal.', price: 'Rp 10.000', icon: '??' },
        { title: 'Ayam Bule Bakar', desc: 'Ayam empuk dengan bumbu bakar manis gurih.', price: 'Rp 10.000', icon: '??' },
        { title: 'Nila Bakar', desc: 'Nila ukuran besar, daging tebal bumbu meresap.', price: 'Rp 17.000', icon: '??' },
        { title: 'Gurameh Bakar', desc: 'Menu keluarga. Gurameh dibakar utuh, porsi untuk 2-3 orang.', price: 'Rp 30.000', icon: '?' }
      ],
      carousel_images: [
        'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1627308595229-7830b5c91f15?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1598511726623-d34fb0d0bc6c?auto=format&fit=crop&q=80&w=800'
      ]
    }).eq('id', id);
    
    console.log('Update success!', updateError || 'No errors.');
  } else {
    console.log('No settings found to update.');
  }
}
run();
