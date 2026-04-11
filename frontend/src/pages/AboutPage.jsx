import { Link } from 'react-router-dom';
import Button from '../components/Button';

const stats = [
  { value: '1,200+', label: 'Orders Delivered' },
  { value: '4.8/5', label: 'Average Rating' },
  { value: '24h', label: 'Support Response' },
  { value: '98%', label: 'Satisfied Customers' },
];

const values = [
  {
    title: 'Comfort First',
    description: 'Every product is selected for real daily comfort, not just visual style.',
  },
  {
    title: 'Honest Value',
    description: 'Transparent pricing and quality materials that make each purchase worth it.',
  },
  {
    title: 'Reliable Service',
    description: 'Fast support, clear communication, and a team that actually follows through.',
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <section className="max-w-6xl mx-auto">
        <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">About Us</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">We design better everyday living</h1>
        <p className="text-textLight text-lg leading-relaxed max-w-3xl">
          Lumina started with one simple idea: furniture should look great, feel comfortable, and stay affordable.
          We curate modern pieces for real homes — from compact apartments to family spaces — so every room can feel more like you.
        </p>
      </section>

      <section className="max-w-6xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div key={item.label} className="bg-white border border-secondary rounded-xl p-5 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary">{item.value}</p>
            <p className="text-sm text-textLight mt-1">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-secondary rounded-xl p-7">
          <h2 className="text-2xl font-bold mb-3">Our Story</h2>
          <p className="text-textLight leading-relaxed mb-4">
            We saw people struggling to find furniture that balances quality, design, and price.
            So we built Lumina to remove that compromise.
          </p>
          <p className="text-textLight leading-relaxed">
            Today, we continue to focus on practical design, durable materials, and fast support — because a beautiful home should also be easy to build.
          </p>
        </div>

        <div className="bg-secondary/20 border border-secondary rounded-xl p-7">
          <h2 className="text-2xl font-bold mb-3">Why Customers Choose Lumina</h2>
          <ul className="space-y-3 text-textMain list-disc list-inside">
            <li>Curated modern furniture with practical dimensions</li>
            <li>Clear product information and realistic photos</li>
            <li>Responsive support before and after purchase</li>
            <li>Trusted checkout with multiple payment options</li>
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-5">What We Stand For</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {values.map((item) => (
            <div key={item.title} className="bg-white border border-secondary rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-textLight">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-12 bg-primary text-white rounded-xl p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to refresh your space?</h2>
        <p className="text-white/90 max-w-2xl">
          Explore our latest collection and find pieces that match your style, your budget, and your daily life.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/products">
            <Button className="bg-white text-primary hover:bg-white/90">Shop Now</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Talk to Our Team
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
