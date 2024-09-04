import supabase from '../config/supabaseClient';
import { useState } from 'react';

const Home = () => {
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;

      console.log('User signed in:', user);
    } catch (error) {
      setError(error.message);
      console.error('Error signing in with Google:', error.message);
    }
  };

  return (
    <div className="page home">
      {/* <button onClick={handleGoogleSignIn}>Sign in with Google</button> */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Home;
