import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'

// components
import SmoothieCard from '../components/SmoothieCard'

const Home = () => {
  const [fetchError, setFetchError] = useState(null)
  const [smoothies, setSmoothies] = useState(null)

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase
        .from('smoothies')
        .select('*')
      
      console.log('Fetched data:', data)
      if (error) {
        setFetchError('Could not fetch the smoothies')
        setSmoothies(null)
      }
      if (data) {
        setSmoothies(data)
        setFetchError(null)
      }
    }

    fetchSmoothies()

  }, [])

  return (
    <div className="page home">
      {fetchError && (<p>{fetchError}</p>)}
      {smoothies && (
        <div className="smoothies">
          {/* order-by buttons */}
          <div className="smoothie-grid">
            {smoothies.map(smoothie => (
              <SmoothieCard key={smoothie.id} smoothie={smoothie} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home