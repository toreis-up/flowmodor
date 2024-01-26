'use client';

import { useEffect, useState } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import supabase from '@/utils/supabase';

function ButtonWrapper({
  type,
  userId,
}: {
  type: any;
  userId: string | undefined;
}) {
  const [{ options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        intent: 'subscription',
      },
    });
  }, [type]);

  if (!userId) {
    return null;
  }

  return (
    <PayPalButtons
      createSubscription={(data, actions) =>
        actions.subscription
          .create({
            plan_id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID,
            custom_id: userId,
          })
          .then((orderId) => {
            console.log(orderId);
            return orderId;
          })
      }
      style={{
        label: 'subscribe',
        color: 'silver',
      }}
    />
  );
}

export default function Upgrade() {
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id);
    })();
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <div className="text-2xl font-semibold">Upgrade to Pro</div>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          components: 'buttons',
          intent: 'subscription',
          vault: true,
        }}
      >
        <div className="rounded-md bg-white p-5">
          <ButtonWrapper type="subscription" userId={userId} />
        </div>
      </PayPalScriptProvider>
    </div>
  );
}