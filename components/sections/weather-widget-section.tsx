'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Wind,
  Droplets,
  Thermometer,
  Loader2
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils/cn';

// Salonta coordinates
const SALONTA_LAT = 46.8025;
const SALONTA_LON = 21.6533;

interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  city: string;
}

// WMO Weather interpretation codes mapping
// https://open-meteo.com/en/docs
const WMO_CODES: Record<number, { description: string; descriptionRo: string; icon: 'sun' | 'cloud' | 'rain' | 'drizzle' | 'snow' | 'thunder' | 'fog' }> = {
  0: { description: 'Clear sky', descriptionRo: 'Cer senin', icon: 'sun' },
  1: { description: 'Mainly clear', descriptionRo: 'Predominant senin', icon: 'sun' },
  2: { description: 'Partly cloudy', descriptionRo: 'Parțial înnorat', icon: 'cloud' },
  3: { description: 'Overcast', descriptionRo: 'Înnorat', icon: 'cloud' },
  45: { description: 'Fog', descriptionRo: 'Ceață', icon: 'fog' },
  48: { description: 'Depositing rime fog', descriptionRo: 'Ceață cu chiciură', icon: 'fog' },
  51: { description: 'Light drizzle', descriptionRo: 'Burniță ușoară', icon: 'drizzle' },
  53: { description: 'Moderate drizzle', descriptionRo: 'Burniță moderată', icon: 'drizzle' },
  55: { description: 'Dense drizzle', descriptionRo: 'Burniță densă', icon: 'drizzle' },
  56: { description: 'Freezing drizzle', descriptionRo: 'Burniță înghețată', icon: 'drizzle' },
  57: { description: 'Dense freezing drizzle', descriptionRo: 'Burniță înghețată densă', icon: 'drizzle' },
  61: { description: 'Slight rain', descriptionRo: 'Ploaie ușoară', icon: 'rain' },
  63: { description: 'Moderate rain', descriptionRo: 'Ploaie moderată', icon: 'rain' },
  65: { description: 'Heavy rain', descriptionRo: 'Ploaie abundentă', icon: 'rain' },
  66: { description: 'Freezing rain', descriptionRo: 'Ploaie înghețată', icon: 'rain' },
  67: { description: 'Heavy freezing rain', descriptionRo: 'Ploaie înghețată abundentă', icon: 'rain' },
  71: { description: 'Slight snow', descriptionRo: 'Ninsoare ușoară', icon: 'snow' },
  73: { description: 'Moderate snow', descriptionRo: 'Ninsoare moderată', icon: 'snow' },
  75: { description: 'Heavy snow', descriptionRo: 'Ninsoare abundentă', icon: 'snow' },
  77: { description: 'Snow grains', descriptionRo: 'Grăunți de zăpadă', icon: 'snow' },
  80: { description: 'Slight rain showers', descriptionRo: 'Averse ușoare', icon: 'rain' },
  81: { description: 'Moderate rain showers', descriptionRo: 'Averse moderate', icon: 'rain' },
  82: { description: 'Violent rain showers', descriptionRo: 'Averse violente', icon: 'rain' },
  85: { description: 'Slight snow showers', descriptionRo: 'Averse de nea ușoare', icon: 'snow' },
  86: { description: 'Heavy snow showers', descriptionRo: 'Averse de nea abundente', icon: 'snow' },
  95: { description: 'Thunderstorm', descriptionRo: 'Furtună', icon: 'thunder' },
  96: { description: 'Thunderstorm with hail', descriptionRo: 'Furtună cu grindină', icon: 'thunder' },
  99: { description: 'Thunderstorm with heavy hail', descriptionRo: 'Furtună cu grindină mare', icon: 'thunder' },
};

// Weather icon mapping based on WMO code
const getWeatherIcon = (weatherCode: number) => {
  const weather = WMO_CODES[weatherCode] || WMO_CODES[0];
  switch (weather.icon) {
    case 'sun': return Sun;
    case 'cloud': return Cloud;
    case 'rain': return CloudRain;
    case 'drizzle': return CloudDrizzle;
    case 'snow': return CloudSnow;
    case 'thunder': return CloudLightning;
    case 'fog': return CloudFog;
    default: return Cloud;
  }
};

// Get background gradient based on weather and temperature
const getWeatherGradient = (weatherCode: number, temperature: number) => {
  const weather = WMO_CODES[weatherCode] || WMO_CODES[0];
  
  // For sunny/clear weather, adjust gradient based on temperature
  if (weather.icon === 'sun') {
    if (temperature <= -5) {
      // Very cold but sunny - icy blue gradient
      return 'from-cyan-400 via-blue-400 to-blue-500';
    } else if (temperature <= 5) {
      // Cold but sunny - cool gradient
      return 'from-amber-300 via-yellow-400 to-cyan-400';
    } else if (temperature >= 30) {
      // Hot and sunny - intense warm gradient
      return 'from-red-400 via-orange-500 to-yellow-500';
    }
    // Normal sunny weather
    return 'from-yellow-400 via-orange-400 to-orange-500';
  }
  
  switch (weather.icon) {
    case 'cloud': return 'from-gray-400 via-gray-500 to-gray-600';
    case 'rain': return 'from-blue-600 via-blue-700 to-blue-800';
    case 'drizzle': return 'from-blue-500 via-blue-600 to-blue-700';
    case 'snow': return 'from-blue-200 via-blue-300 to-blue-400';
    case 'thunder': return 'from-purple-600 via-purple-700 to-purple-800';
    case 'fog': return 'from-gray-300 via-gray-400 to-gray-500';
    default: return 'from-blue-500 via-blue-600 to-blue-700';
  }
};

// Get weather description in Romanian
const getWeatherDescription = (weatherCode: number): string => {
  return WMO_CODES[weatherCode]?.descriptionRo || 'Necunoscut';
};

export function WeatherWidgetSection() {
  const t = useTranslations('homepage');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using Open-Meteo API - completely free, no API key required
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${SALONTA_LAT}&longitude=${SALONTA_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Europe%2FBucharest`
        );
        
        if (!response.ok) throw new Error('Weather fetch failed');
        
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          description: getWeatherDescription(data.current.weather_code),
          weatherCode: data.current.weather_code,
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          city: 'Salonta',
        });
        setError(false);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-4">
        <Container>
          <div className="flex items-center justify-center gap-2 text-white">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t('loadingWeather')}</span>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gradient-to-r from-gray-500 to-gray-600 py-4">
        <Container>
          <div className="flex items-center justify-center gap-2 text-white">
            <Cloud className="w-5 h-5" />
            <span>{t('weatherUnavailable') || 'Vremea nu este disponibilă momentan'}</span>
          </div>
        </Container>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.weatherCode);

  return (
    <div className={cn(
      'bg-gradient-to-r py-4 text-white',
      getWeatherGradient(weather.weatherCode, weather.temperature)
    )}>
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {/* Main temperature */}
          <div className="flex items-center gap-3">
            <WeatherIcon className="w-10 h-10 md:w-12 md:h-12" />
            <div>
              <div className="text-3xl md:text-4xl font-bold">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-white/80 capitalize">
                {weather.description}
              </div>
            </div>
          </div>

          {/* City name */}
          <div className="hidden sm:block text-center">
            <div className="text-lg font-semibold">{weather.city}</div>
            <div className="text-sm text-white/80">{t('weatherNow')}</div>
          </div>

          {/* Weather details */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2" title={t('feelsLike')}>
              <Thermometer className="w-5 h-5" />
              <span className="text-sm">{weather.feelsLike}°C</span>
            </div>
            <div className="flex items-center gap-2" title={t('humidity')}>
              <Droplets className="w-5 h-5" />
              <span className="text-sm">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2" title={t('wind')}>
              <Wind className="w-5 h-5" />
              <span className="text-sm">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

