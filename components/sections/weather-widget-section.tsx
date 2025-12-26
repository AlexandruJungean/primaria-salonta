'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
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
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

// Weather icon mapping
const getWeatherIcon = (iconCode: string) => {
  if (iconCode.includes('01')) return Sun;
  if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return Cloud;
  if (iconCode.includes('09') || iconCode.includes('10')) return CloudRain;
  if (iconCode.includes('11')) return CloudLightning;
  if (iconCode.includes('13')) return CloudSnow;
  return Cloud;
};

// Get background gradient based on weather
const getWeatherGradient = (iconCode: string) => {
  if (iconCode.includes('01')) return 'from-yellow-400 via-orange-400 to-orange-500'; // Clear
  if (iconCode.includes('02')) return 'from-blue-400 via-blue-500 to-blue-600'; // Few clouds
  if (iconCode.includes('03') || iconCode.includes('04')) return 'from-gray-400 via-gray-500 to-gray-600'; // Cloudy
  if (iconCode.includes('09') || iconCode.includes('10')) return 'from-blue-600 via-blue-700 to-blue-800'; // Rain
  if (iconCode.includes('11')) return 'from-purple-600 via-purple-700 to-purple-800'; // Thunderstorm
  if (iconCode.includes('13')) return 'from-blue-200 via-blue-300 to-blue-400'; // Snow
  return 'from-blue-500 via-blue-600 to-blue-700';
};

export function WeatherWidgetSection() {
  const t = useTranslations('homepage');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        // Use mock data if no API key
        setWeather({
          temperature: 5,
          feelsLike: 2,
          description: 'Parțial înnorat',
          icon: '02d',
          humidity: 65,
          windSpeed: 12,
          city: 'Salonta',
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${SALONTA_LAT}&lon=${SALONTA_LON}&units=metric&lang=ro&appid=${apiKey}`
        );
        
        if (!response.ok) throw new Error('Weather fetch failed');
        
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          city: 'Salonta',
        });
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        // Fallback to mock data
        setWeather({
          temperature: 5,
          feelsLike: 2,
          description: 'Parțial înnorat',
          icon: '02d',
          humidity: 65,
          windSpeed: 12,
          city: 'Salonta',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
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

  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.icon);

  return (
    <div className={cn(
      'bg-gradient-to-r py-4 text-white',
      getWeatherGradient(weather.icon)
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

