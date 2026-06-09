import { useEffect } from 'react'
import { useContext } from 'react'
import { PVPCContext } from '../context/PVPCContext'

export function usePVPCFetch() {
  const { setPVPC, setLoading, setError } = useContext(PVPCContext)

  useEffect(() => {
    async function fetchPVPC() {
      setLoading(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/pvpc/today`
        )
        if (!response.ok) throw new Error('Backend unavailable')
        const data = await response.json()
        setPVPC(data)
      } catch (err) {
        // Cargar desde caché local
        const cached = await AsyncStorage.getItem('pvpc_cache_v1')
        if (cached) {
          setPVPC(JSON.parse(cached))
          setError('Usando precio del día anterior')
        } else {
          setError('No hay datos PVPC disponibles')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPVPC()
  }, [])
}