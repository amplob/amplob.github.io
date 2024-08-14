import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

const TextBoard = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('textboard')
        .select();

      if (error) {
        setFetchError('Could not fetch entries');
        setEntries([]);
      } else {
        setEntries(data);
        setFetchError(null);
      }
    };

    fetchEntries();
  }, []);

  const addEntry = async () => {
    if (newEntry.trim() === '') return;

    const { data, error } = await supabase
      .from('textboard')
      .insert([{ text: newEntry }]);

    if (error) {
      console.error('Error adding entry:', error);
    } else {
      setEntries([...entries, ...data]);
      setNewEntry('');
    }
  };

  const deleteEntry = async (id) => {
    const { error } = await supabase
      .from('textboard')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entry:', error);
    } else {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  return (
    <div className="page textboard">
      <h2>Text Board</h2>
      {fetchError && (<p>{fetchError}</p>)}
      <div className="entries">
        {entries.map(entry => (
          <div key={entry.id} className="entry">
            <p>{entry.text}</p>
            <button onClick={() => deleteEntry(entry.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="new-entry">
        <input 
          type="text" 
          value={newEntry} 
          onChange={(e) => setNewEntry(e.target.value)} 
          placeholder="Type a new entry" 
        />
        <button onClick={addEntry}>Add Entry</button>
      </div>
    </div>
  );
};

export default TextBoard;