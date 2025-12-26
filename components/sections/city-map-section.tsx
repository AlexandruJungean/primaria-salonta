'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { 
  Building2, 
  Stethoscope, 
  GraduationCap, 
  Dumbbell, 
  Landmark, 
  ShoppingBag,
  MapPin,
  Loader2,
  TreePine,
  Train
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Salonta coordinates (centered on city)
const SALONTA_CENTER = {
  lat: 46.8030,
  lng: 21.6550,
};

const MAP_STYLES = {
  width: '100%',
  height: '500px',
};

// Location categories with colors
const CATEGORIES = [
  { id: 'administration', icon: Building2, color: '#00319c', label: 'Administrație' },
  { id: 'health', icon: Stethoscope, color: '#dc2626', label: 'Sănătate' },
  { id: 'education', icon: GraduationCap, color: '#16a34a', label: 'Educație' },
  { id: 'sports', icon: Dumbbell, color: '#ea580c', label: 'Sport' },
  { id: 'culture', icon: Landmark, color: '#9333ea', label: 'Cultură' },
  { id: 'parks', icon: TreePine, color: '#22c55e', label: 'Parcuri' },
  { id: 'transport', icon: Train, color: '#64748b', label: 'Transport' },
  { id: 'commerce', icon: ShoppingBag, color: '#0891b2', label: 'Comerț' },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

// Locations data with REAL coordinates from Google Maps
const LOCATIONS: Array<{
  id: string;
  name: string;
  category: CategoryId;
  lat: number;
  lng: number;
  description?: string;
}> = [
  // Administration
  { id: 'primaria', name: 'Primăria Municipiului Salonta', category: 'administration', lat: 46.8025222, lng: 21.6595906, description: 'Str. Republicii nr. 1' },
  
  // Health
  { id: 'spital', name: 'Spitalul Municipal Salonta', category: 'health', lat: 46.8050178, lng: 21.6690055, description: 'Servicii medicale de urgență și spitalizare' },
  
  // Education
  { id: 'liceu-arany', name: 'Liceul Teoretic Arany János', category: 'education', lat: 46.8029962, lng: 21.6633564, description: 'Liceu cu predare în limba maghiară' },
  { id: 'colegiu-nes', name: 'Colegiul Național Teodor Neș', category: 'education', lat: 46.8059456, lng: 21.6469663, description: 'Colegiu național' },
  { id: 'liceu-tehnologic', name: 'Liceul Tehnologic Nr. 1', category: 'education', lat: 46.7993278, lng: 21.6398563, description: 'Învățământ tehnic și profesional' },
  
  // Sports
  { id: 'bazin', name: 'Bazinul de Înot Municipal', category: 'sports', lat: 46.8047792, lng: 21.6726911, description: 'Bazin de înot acoperit' },
  { id: 'strand', name: 'Ștrandul Municipal', category: 'sports', lat: 46.805785, lng: 21.6452463, description: 'Strand și zone de relaxare' },
  { id: 'stadion', name: 'Stadionul Municipal Salonta', category: 'sports', lat: 46.8036072, lng: 21.6705378, description: 'Fotbal și atletism' },
  { id: 'stadion-sintetic', name: 'Stadion Sintetic Salonta', category: 'sports', lat: 46.7993192, lng: 21.6471697, description: 'Teren sintetic de fotbal' },
  { id: 'sala-sport', name: 'Sala de Sport Nicolae Talpoș', category: 'sports', lat: 46.8007062, lng: 21.6375332, description: 'Handbal, baschet, volei' },
  
  // Culture
  { id: 'muzeu-arany', name: 'Muzeul Memorial Arany János', category: 'culture', lat: 46.8024069, lng: 21.6633312, description: 'Muzeu dedicat poetului Arany János' },
  { id: 'muzeu-taran', name: 'Muzeul Țăranului Român', category: 'culture', lat: 46.7993721, lng: 21.6353917, description: 'Tradiții și cultură țărănească' },
  { id: 'casa-cultura', name: 'Casa de Cultură Zilahy Lajos', category: 'culture', lat: 46.8038183, lng: 21.6607278, description: 'Evenimente culturale și spectacole' },
  { id: 'biblioteca', name: 'Biblioteca Municipală Teodor Neș', category: 'culture', lat: 46.8020922, lng: 21.6633108, description: 'Bibliotecă publică' },
  { id: 'biserica-reformata', name: 'Biserica Reformată Maghiară', category: 'culture', lat: 46.8014811, lng: 21.6605081, description: 'Monument istoric' },
  { id: 'cuibul-dropiei', name: 'Cuibul Dropiei', category: 'culture', lat: 46.7909077, lng: 21.6349376, description: 'Atracție turistică - Great Bustard\'s Nest' },
  
  // Parks
  { id: 'parc-central', name: 'Parcul Central (Parcul Mare)', category: 'parks', lat: 46.8020252, lng: 21.6612739, description: 'Parc central al orașului' },
  { id: 'parc-gara', name: 'Parcul de la Gară', category: 'parks', lat: 46.8071367, lng: 21.6448042, description: 'Zonă verde lângă gară' },
  
  // Transport
  { id: 'gara', name: 'Gara Salonta', category: 'transport', lat: 46.8093311, lng: 21.6422084, description: 'Gară CFR' },
  
  // Commerce
  { id: 'piata', name: 'Piața Agroalimentară', category: 'commerce', lat: 46.8039734, lng: 21.6649425, description: 'Piață cu produse locale' },
];

// Custom marker icon URLs based on category
const getMarkerIcon = (category: CategoryId) => {
  const categoryData = CATEGORIES.find(c => c.id === category);
  const color = categoryData?.color || '#6b7280';
  
  // Create SVG marker
  return {
    url: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="${color}"/>
        <circle cx="12" cy="12" r="6" fill="white"/>
      </svg>
    `)}`,
    scaledSize: { width: 32, height: 48 } as google.maps.Size,
    anchor: { x: 16, y: 48 } as google.maps.Point,
  };
};

export function CityMapSection() {
  const t = useTranslations('homepage');
  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATIONS[0] | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(
    new Set(CATEGORIES.map(c => c.id))
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const toggleCategory = (categoryId: CategoryId) => {
    const newCategories = new Set(activeCategories);
    if (newCategories.has(categoryId)) {
      newCategories.delete(categoryId);
    } else {
      newCategories.add(categoryId);
    }
    setActiveCategories(newCategories);
  };

  const filteredLocations = LOCATIONS.filter(loc => activeCategories.has(loc.category));

  // Fallback if Google Maps fails to load
  if (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <Section background="white">
        <Container>
          <SectionHeader 
            title={t('cityMap')} 
            subtitle={t('cityMapSubtitle')} 
          />
          
          <div className="bg-gray-100 rounded-xl p-8 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Hartă interactivă
            </h3>
            <p className="text-gray-500 mb-4">
              Pentru a vizualiza harta interactivă, vă rugăm să configurați Google Maps API.
            </p>
            <a 
              href="https://www.google.com/maps/place/Salonta,+Romania"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Deschide în Google Maps →
            </a>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="white">
      <Container>
        <SectionHeader 
          title={t('cityMap')} 
          subtitle={t('cityMapSubtitle')} 
        />

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategories.has(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                  isActive 
                    ? 'text-white shadow-md' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                )}
                style={isActive ? { backgroundColor: category.color } : {}}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Map */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          {!isLoaded ? (
            <div className="h-[500px] bg-gray-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={MAP_STYLES}
              center={SALONTA_CENTER}
              zoom={14}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                styles: [
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                  },
                ],
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
              }}
            >
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  icon={getMarkerIcon(location.category)}
                  onClick={() => setSelectedLocation(location)}
                />
              ))}

              {selectedLocation && (
                <InfoWindow
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="p-2 max-w-xs">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {selectedLocation.name}
                    </h3>
                    {selectedLocation.description && (
                      <p className="text-sm text-gray-600">
                        {selectedLocation.description}
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{category.label}</span>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

