import axios from 'axios';
import { useState, useEffect } from 'react';

import { useTheme, View, Button, Collection, Card, Flex, Heading, Image, Text, Loader } from '@aws-amplify/ui-react';
import { useTranslation } from "react-i18next";

import { API_BASE_URL } from '../constants';

const initState = {
  destination: '',
  duration: '',
  persona: ''
};

const Prompt = () => {
  const { tokens } = useTheme();
  const { i18n, t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(initState);
  const [itineraries, setItineraries] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function updateImages() {
      for (let caption of captions) {
        setLoading(true);
        
        try {
          const { data } = await axios({
            url: '/image',
            method: 'post',
            baseURL: API_BASE_URL,
            data: { caption }
          });
  
          setImages(images => [...images, data.image]);
          console.log(images);
        } catch (err) {
          console.log(err);
        }

        setLoading(false);
      }
    }

    updateImages();
    // use [] to run this only on component mount (initially)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captions] )
  
  function onChangeDestination(event) {
    setState(currentState => ({ ...currentState, destination: event.target.value }));
  }
  
  function onChangeDuration(event) {
    setState(currentState => ({ ...currentState, duration: event.target.value }));
  }
  
  function onChangePersona(event) {
    setState(currentState => ({ ...currentState, persona: event.target.value }));
  }

  async function save() {
    console.log('saving')
    console.log(i18n.language)
    console.log(state)

    setImages([])
    if (state.destination && state.duration && state.persona) {
      setLoading(true)
      try {
        const { data } = await axios({
          url: '/text',
          method: 'post',
          baseURL: API_BASE_URL,
          data: {
            language: i18n.language,
            destination: state.destination,
            persona: state.persona,
            duration: state.duration
          }
        });
  
        setItineraries(data.itineraries);
        setCaptions(data.captions);
      }
      catch(e) {
        console.error(e);
      }
      finally {
        setLoading(false)
      }
    }
  }

  return (
    <View>
      <View className='prompt'>
        {t("action")}

        <input 
          type="text" 
          name="destination" 
          defaultValue="" 
          placeholder="__________" 
          size="10" 
          onChange={onChangeDestination}
        />
        {t("duration")} 
        <select name="duration" defaultValue="" onChange={onChangeDuration}>
          <option disabled value=""> _ </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
        {t("day")}
        <select name="persona" defaultValue="" onChange={onChangePersona}>
          <option disabled value=""> __________ </option>
          <option value={t("v_alone")}>{t("alone")}</option>
          <option value={t("v_couple")}>{t("couple")}</option>
          <option value={t("v_group")}>{t("group")}</option>
          <option value={t("v_family")}>{t("family")}</option>
        </select>.
      </View>

      <Button variation='primary' size='large' onClick={save}>
        {t("generate")}
      </Button> 

      {loading ? 
        <View margin={tokens.space.large}>
          <Loader 
            size="large"
          />
        </View>
        : ''
      }
      
      <Collection
        type="list"
        items={itineraries}
        gap="1.5rem"
      >
        {(item, index) => (
          <Card key={index} padding="1rem">
            <Flex direction="column" alignItems="center">
              <Heading padding={tokens.space.large} level={3}>{`${t("r_day")} ${index + 1}`}</Heading>

              <Image
                alt={captions[index]}
                src={`data:image/jpeg;base64,${images[index]}`}
                height="384px"
              />
              
              <Text
                variation="secondary"
                as="p"
                lineHeight="1.5em"
                fontWeight={400}
                fontSize="1em"
                fontStyle="italic"
                textDecoration="none"
                width="30vw"
              >
                {captions[index]}
              </Text>

              {item.split('\n').map(act => act.trim()).map((bullet, idx) => 
                <Text
                  key={idx}
                  variation="primary"
                  as="p"
                  lineHeight="1.5em"
                  fontWeight={400}
                  fontSize="1em"
                  fontStyle="none"
                  textDecoration="none"
                  width="30vw"
                >
                  {bullet}
                </Text>
              )}
            </Flex>
          </Card>
        )}
      </Collection>
    </View>
  );
};

export default Prompt;