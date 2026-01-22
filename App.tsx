
import React, { useState, Suspense, lazy, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import ServiceCard from './components/ServiceCard';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import VIPConcierge from './components/VIPConcierge';
import ParticlesBackground from './components/ParticlesBackground';
import SmartAIChat, { SmartAIChatRef } from './components/SmartAIChat';
import { SERVICES } from './constants';
import { Service, Review } from './types';

// Lazy load heavy components to improve initial bundle size
const Portfolio = lazy(() => import('./components/Portfolio'));
const VideoGallery = lazy(() => import('./components/VideoGallery'));
const GeminiAssistant = lazy(() => import('./components/GeminiAssistant'));
const PhotoAnalyzer = lazy(() => import('./components/PhotoAnalyzer'));
const LatestUpdates = lazy(() => import('./components/LatestUpdates'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const ServiceReviewsModal = lazy(() => import('./components/ServiceReviewsModal'));
const AddServiceModal = lazy(() => import('./components/AddServiceModal'));
const BeforeAfter = lazy(() => import('./components/BeforeAfter'));
const Packages = lazy(() => import('./components/Packages'));
const TechStack = lazy(() => import('./components/TechStack'));

const SERVICE_FILTERS = [
  { id: 'الكل', label: 'الكل', icon: '🌐' },
  { id: 'خدمات رقمية', label: 'خدمات رقمية', icon: '💻' },
  { id: 'معاملات رسمية', label: 'معاملات رسمية', icon: '⚖️' },
  { id: 'تحويل أموال', label: 'تحويل أموال', icon: '💸' },
  { id: 'فرص عمل', label: 'فرص عمل', icon: '🤝' },
  { id: 'أخرى', label: 'أخرى', icon: '✨' }
];

const LoadingFallback = () => (
  <div className="py-20 flex justify-center items-center">
    <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [selectedServiceForReview, setSelectedServiceForReview] = useState<Service | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [activeServiceFilter, setActiveServiceFilter] = useState('الكل');
  
  const chatRef = useRef<SmartAIChatRef>(null);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenReviews = (service: Service) => {
    setSelectedServiceForReview(service);
  };

  const handleConsultAI = (service: Service) => {
    if (chatRef.current) {
      chatRef.current.openChat(`أنا مهتم بخدمة "${service.title}". هل يمكنك تزويدي بمزيد من التفاصيل عنها أو نصائح قبل طلبها؟`);
    }
  };

  const handleCloseReviews = () => {
    setSelectedServiceForReview(null);
  };

  const handleAddReview = (serviceId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ar-EG'),
      ...reviewData
    };

    setServices(prevServices => prevServices.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          reviews: [...service.reviews, newReview]
        };
      }
      return service;
    }));

    // Update the selected service state as well to reflect changes immediately in modal
    if (selectedServiceForReview && selectedServiceForReview.id === serviceId) {
       setSelectedServiceForReview(prev => prev ? ({
         ...prev,
         reviews: [...prev.reviews, newReview]
       }) : null);
    }
  };

  const filteredServices = activeServiceFilter === 'الكل'
    ? services
    : services.filter(service => service.category === activeServiceFilter);

  return (
    <div className={`min-h-screen theme-transition ${theme === 'light' ? 'theme-light' : ''} bg-[var(--bg-color)] text-[var(--text-color)] relative`}>
      <ParticlesBackground theme={theme} />
      <CustomCursor />
      <ScrollProgress />
      <VIPConcierge theme={theme} />
      
      {/* Smart AI Chat Feature with Ref */}
      <SmartAIChat ref={chatRef} />

      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-400 text-black py-2.5 px-4 text-center text-sm font-black relative z-[60] shadow-xl overflow-x-auto whitespace-nowrap scrollbar-hide">
        <span className="inline-block min-w-full">
          ⭐ أهلاً بكم في عالم حلبي للخدمات الرقمية - التميز هو خيارنا الوحيد
        </span>
      </div>
      
      <Navbar theme={theme} toggleTheme={toggleTheme} onOpenAddService={() => setIsAddServiceOpen(true)} />
      
      <main className="relative z-10">
        <Hero theme={theme} />

        {/* Why Choose Us Section - Kept eager for smoother scrolling immediately after hero */}
        <WhyChooseUs theme={theme} />

        <Suspense fallback={<LoadingFallback />}>
          {/* Digital Fabrics (Tech Stack) */}
          <TechStack theme={theme} />
        </Suspense>

        {/* Services Section - Kept ServiceCard eager but section logic is here */}
        <section id="services" className="py-20 md:py-32 px-4 max-w-7xl mx-auto scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 gold-text">دليل الخدمات</h2>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-xl max-w-2xl mx-auto font-light`}>تصفح كافة الخدمات المتاحة أو استخدم الفلاتر للوصول لطلبك بسرعة.</p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-10 rounded-full"></div>
          </div>
          
          {/* Service Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {SERVICE_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveServiceFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-sm md:text-base border-2 ${
                  activeServiceFilter === filter.id
                    ? 'bg-amber-500 border-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-110' 
                    : `${theme === 'light' ? 'bg-white text-gray-500 hover:text-black border-gray-200 hover:border-amber-500/50' : 'bg-white/5 text-gray-400 hover:text-white border-white/5 hover:border-amber-500/50'} hover:bg-white/10`
                }`}
              >
                <span className="text-lg">{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          <div key={activeServiceFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <div 
                  key={service.id} 
                  className="animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 fill-mode-both"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ServiceCard 
                    service={service} 
                    theme={theme} 
                    onViewReviews={handleOpenReviews}
                    onConsultAI={handleConsultAI}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-20 text-gray-500 animate-in fade-in duration-500">
                <div className="text-4xl mb-4 opacity-50">📂</div>
                <p>لا توجد خدمات متاحة في هذا التصنيف حالياً.</p>
              </div>
            )}
          </div>
        </section>

        <Suspense fallback={<LoadingFallback />}>
          {/* Fashion-Themed Packages */}
          <Packages theme={theme} />

          {/* Fitting Room (Before/After) */}
          <BeforeAfter theme={theme} />

          {/* Portfolio Section */}
          <Portfolio theme={theme} />

          {/* Video Gallery Section */}
          <VideoGallery theme={theme} />

          {/* Latest Updates Section */}
          <LatestUpdates theme={theme} />

          {/* AI Lab Section Header */}
          <section className="pt-32 pb-10 px-4 max-w-7xl mx-auto text-center">
              <span className="px-4 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20 mb-6 inline-block">HALABI AI LAB</span>
              <h2 className="text-4xl md:text-6xl font-black gold-text">مختبر حلبي للذكاء الاصطناعي</h2>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-6 max-w-3xl mx-auto text-lg`}>استخدم أحدث تقنيات Gemini لتوليد الأفكار وتحليل التصاميم مجاناً قبل طلب الخدمة.</p>
          </section>

          {/* AI Integration Section 1: Content Generation */}
          <section className="pb-10 px-4">
            <GeminiAssistant theme={theme} />
          </section>

          {/* AI Integration Section 2: Photo Analysis */}
          <section className="pb-32 px-4">
            <PhotoAnalyzer theme={theme} />
          </section>
        </Suspense>

        {/* Visual Showcase / Process - kept inline as it uses standard HTML mostly */}
        <section className={`py-32 ${theme === 'light' ? 'bg-neutral-100' : 'bg-neutral-900/30'} border-y border-white/5`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/2">
                <h3 className="text-4xl md:text-6xl font-black mb-10 leading-tight">كيف نعمل؟<br/><span className="text-amber-500">البساطة في قمة الفخامة</span></h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-2xl font-black group-hover:bg-amber-500 group-hover:text-black transition-all">1</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">تواصل مباشر</h4>
                      <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>تحدث معنا عبر الواتساب واشرح فكرتك أو الخدمة التي تطلبها بكل بساطة.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group text-right">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-2xl font-black group-hover:bg-amber-500 group-hover:text-black transition-all">2</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">دفع آمن (شام كاش)</h4>
                      <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>نوفر لك أسهل طريقة دفع داخل سوريا عبر خدمة شام كاش الموثوقة.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-2xl font-black group-hover:bg-amber-500 group-hover:text-black transition-all">3</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">استلام بجودة 4K</h4>
                      <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>استلم عملك النهائي بدقة احترافية وسرعة لم تشهدها من قبل.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="absolute -inset-4 bg-amber-500/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400" alt="Process" className="rounded-[2.5rem] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border border-white/10" />
                  <div className="flex flex-col gap-4 mt-12">
                    <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=400" alt="Process" className="rounded-[2.5rem] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border border-white/10" />
                    <img src="https://images.unsplash.com/photo-1493421419110-74f4e85ba126?auto=format&fit=crop&q=80&w=400" alt="Process" className="rounded-[2.5rem] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border border-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<LoadingFallback />}>
          {/* Contact Form Section */}
          <ContactForm theme={theme} />
        </Suspense>

      </main>

      <Footer theme={theme} />

      <Suspense fallback={null}>
        {/* Reviews Modal */}
        <ServiceReviewsModal 
          service={selectedServiceForReview}
          isOpen={!!selectedServiceForReview}
          onClose={handleCloseReviews}
          onAddReview={handleAddReview}
          theme={theme}
        />

        {/* Add Service Modal */}
        <AddServiceModal 
          isOpen={isAddServiceOpen}
          onClose={() => setIsAddServiceOpen(false)}
          theme={theme}
        />
      </Suspense>
    </div>
  );
};

export default App;
