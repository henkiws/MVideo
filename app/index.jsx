import { StatusBar } from 'expo-status-bar'
import { Text, View, ScrollView, Image } from 'react-native'
import { Link, router, Redirect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import 'react-native-url-polyfill/auto'

import { images } from '../constants'
import CustomButton from './components/CustomButton'
import { useGlobalContext } from '../context/GlobalProvider'

export default function App() {

    const {isLoading, isLoggedIn} = useGlobalContext();

    console.log('isLoggedIn ',isLoggedIn)

    if(!isLoading && isLoggedIn) return <Redirect href="/home" />

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className="w-full justify-center items-center min-h-[85vh] px-4">
                    <Image 
                        source={images.logo}
                        className="w-[130px] h-[74px]"
                        resizeMode='contain'
                    />

                    <Image 
                        source={images.cards}
                        className="max-w-[380px] w-full h-[300px]"
                        resizeMode='contain'
                    />

                    <View className="relative mt-5">
                        <Text className="text-3xl text-white font-bold text-center">
                            Discover Endless Posibilities with{' '}
                            <Text className="text-secondary-200">mVideo</Text>
                        </Text>
                    </View>

                    <Image 
                        source={images.path}
                        className="w-[136px] h-[15px] absolute-bottom-2 -right-8"
                        resizeMode='contain'
                    />

                    <Text className="text-sm font-pregular text-gray-100 mt-7 text-center ">Where creatifity meets inovation: embark on a journey of limitless exploration with mVideo</Text>

                    <CustomButton 
                        title="Continue with Email"
                        handlePress={() => router.push('/sign-in')}
                        containerStyles="w-full m-8"
                    />

                    <StatusBar backgroundColor='#161622' style="light"/>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}