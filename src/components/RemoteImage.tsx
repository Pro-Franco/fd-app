/*import { Image } from 'react-native';
import React, { ComponentProps, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type RemoteImageProps = {
  path?: string | null;
  fallback: string | number; // agora aceita URL ou require('./local.png')
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!path) {
      setError(true);
      return;
    }

    const fetchImage = async () => {
      setError(false);
      setImage(null);
      const { data, error } = await supabase.storage
        .from('product-images')
        .download(path);

      if (error || !data) {
        console.log('Erro ao baixar imagem do Supabase:', error);
        setError(true);
        return;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setImage(fr.result as string);
      };
    };

    fetchImage();
  }, [path]);

  const source = error
    ? typeof fallback === 'string'
      ? { uri: fallback }
      : fallback // se for require('./local.png')
    : image
    ? { uri: image }
    : null;

  if (!source) return null;

  return <Image source={source} {...imageProps} />;
};

export default RemoteImage;*/

import { Image } from 'react-native';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!path) return;
    (async () => {
      setImage('');
      const { data, error } = await supabase.storage
        .from('product-images')
        .download(path);

      if (error) {
        console.log(error);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  if (!image) {
  }

  return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;
