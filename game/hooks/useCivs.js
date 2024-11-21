// src/hooks/useCivs.js

import { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';

export const useCivs = () => {
  const [allCivs, setAllCivs] = useState([]);

  useEffect(() => {
    const fetchAllCivs = async () => {
      const { data: civs, error } = await supabase.from('civs').select('*');
      if (error) {
        console.error('Error fetching civs:', error);
      } else {
        setAllCivs(civs.map(civ => ({ ...civ, used: false, guessedCorrectly: false })));
      }
    };

    fetchAllCivs();
  }, []);

  return {allCivs, setAllCivs};
};
