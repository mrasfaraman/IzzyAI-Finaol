// PaymentScreen.tsx

import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, SafeAreaView} from 'react-native';
import WebView from 'react-native-webview';
import BaseURL from '../components/ApiCreds';

const PaymentScreen: React.FC = () => {
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCheckoutUrlFromApi = async (): Promise<void> => {
      try {
        const response = await fetch(BaseURL + '/get_checkout_url');
        const data = await response.json();
        if (response.status === 200) {
          setCheckoutUrl(data.checkout_url);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching checkout URL:', error);
        setLoading(false);
      }
    };

    fetchCheckoutUrlFromApi();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      {loading ? (
        <ActivityIndicator size="large" color={'black'} />
      ) : (
        <WebView source={{uri: checkoutUrl}} style={{flex: 1}} />
      )}
    </SafeAreaView>
  );
};

export default PaymentScreen;
