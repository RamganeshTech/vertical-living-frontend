import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

const useGetRole = () => {
return useSelector((state:RootState)=> state.authStore)
}

export default useGetRole