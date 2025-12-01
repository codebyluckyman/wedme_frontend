import { LinkPreview } from '@/app/@types';
import axios from 'axios';

export const fetchLinkPreview = async (
  url: string
): Promise<LinkPreview | null> => {
  try {
    const data = { q: url };
    const response = await axios.post(
      'https://api.peekalink.io/',
      {
        link: data.q,
      },
      {
        headers: {
          Authorization: 'Bearer sk_cof83jv0gh2gbplruns4f7g4rbiakrlf',
        },
      }
    );

    const result = response.data;

    const preview: LinkPreview = {
      title: result.title,
      description: result.description,
      image: result.image?.original?.url || '',
      url: result.url,
      favicon: result.icon?.url,
      domain: result.domain,
    };

    return preview;
  } catch (error) {
    console.log('Error fetching link preview:', error);
    return null;
  }
};
