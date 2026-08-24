
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { CheckCircle2, ChevronRight, Share2 } from 'lucide-react';



export default function KuesionerPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    menu_favorit: '',
    tingkat_pedas: 'Sedang',
    saran: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.nama) {
      toast.error('Silakan isi nama Anda terlebih dahulu');
      return;
    }
    if (step === 2 && !formData.menu_favorit) {
      toast.error('Silakan pilih lauk favorit Anda');
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('survey_responses').insert([
        {
          nama: formData.nama,
          whatsapp: formData.whatsapp,
          menu_favorit: formData.menu_favorit,
          tingkat_pedas: formData.tingkat_pedas,
          saran: formData.saran,
        }
      ]);

      if (error) throw error;
      
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      toast.error('Gagal mengirim data: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const text = 'Halo warga! Yuk bantu isi kuesioner menu Ikan Bakar P. Tris untuk Puri Delta: https://ikanbakar99.vercel.app/kuesioner';
    window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-8">
          <CardContent className="space-y-4 flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Terima Kasih, {formData.nama}!</h2>
            <p className="text-slate-600">
              Masukan Anda sangat berarti bagi kami untuk menyajikan rasa terbaik di Puri Delta.
            </p>
            <Button onClick={handleShare} className="mt-4 gap-2">
              <Share2 className="w-4 h-4" />
              Bagikan ke Grup Warga
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-8 p-4">
      <div className="w-full max-w-md mb-6">
        <h1 className="text-2xl font-bold text-slate-800 text-center">Kuesioner Warga</h1>
        <p className="text-slate-500 text-center text-sm mt-1">Bantu kami hadirkan menu kesukaan Anda!</p>
      </div>

      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-xl">
            {step === 1 && "Kenalan Dulu Yuk"}
            {step === 2 && "Menu Favorit"}
            {step === 3 && "Tingkat Kepedasan"}
            {step === 4 && "Saran & Masukan"}
          </CardTitle>
          <CardDescription>
            Langkah {step} dari 4
          </CardDescription>
        </CardHeader>

        <CardContent className="min-h-[220px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <Label htmlFor="nama">Siapa nama / panggilan Anda? <span className="text-red-500">*</span></Label>
                <Input 
                  id="nama" 
                  placeholder="Misal: Bp. Budi / Bu Ani" 
                  value={formData.nama}
                  onChange={(e) => handleChange('nama', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Nomor WA (Opsional)</Label>
                <Input 
                  id="whatsapp" 
                  placeholder="Untuk info promo diskon opening" 
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Label>Lauk apa yang paling sering dicari untuk makan malam? <span className="text-red-500">*</span></Label>
              <RadioGroup 
                value={formData.menu_favorit} 
                onValueChange={(val) => handleChange('menu_favorit', val)}
                className="flex flex-col gap-3 mt-2"
              >
                {['Ikan Gurameh Bakar', 'Ikan Lele Bakar', 'Ikan Nila Bakar', 'Ayam Bule Bakar', 'Bebek Bakar'].map((menu) => (
                  <div key={menu} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value={menu} id={menu} />
                    <Label htmlFor={menu} className="flex-1 cursor-pointer">{menu}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Label>Seberapa pedas sambal yang ideal menurut Anda?</Label>
              <div className="pt-6 pb-2">
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={50}
                  onValueChange={(vals) => {
                    const val = vals[0];
                    if (val === 0) handleChange('tingkat_pedas', 'Tidak Pedas / Manis');
                    else if (val === 50) handleChange('tingkat_pedas', 'Sedang');
                    else handleChange('tingkat_pedas', 'Sangat Pedas');
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Manis</span>
                <span>Sedang</span>
                <span>Sangat Pedas</span>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg text-primary font-semibold">
                Pilihan: {formData.tingkat_pedas}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <Label htmlFor="saran">Ada saran/masukan untuk warung kami nanti? (Opsional)</Label>
                <Textarea 
                  id="saran" 
                  placeholder="Misal: Buka sampai jam 10 malam dong, atau sediakan es teh jumbo..." 
                  rows={4}
                  value={formData.saran}
                  onChange={(e) => handleChange('saran', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-4 bg-slate-50 rounded-b-xl">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(s => s - 1)}>
              Kembali
            </Button>
          ) : (
            <div></div> // Placeholder to keep layout balanced
          )}
          
          {step < 4 ? (
            <Button onClick={handleNext} className="gap-1">
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-1">
              {isSubmitting ? "Mengirim..." : "Kirim Kuesioner"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
