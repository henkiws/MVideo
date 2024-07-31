import { View, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import EmptyState from '../components/EmptyState'
import { getUserPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../components/InfoBox'
import { router } from 'expo-router'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  const { data: posts, refetch } = useAppwrite( () => getUserPosts(user.$id) )

  const logout = async () => {
    await signOut()
    setUser(null)
    setIsLoggedIn(false)

    router.replace('/sign-in')
  }

  return (
    <SafeAreaView className="bg-primary border-2 h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-18"
              onPress={logout}
            >
              <Image 
                source={icons.logout}
                resizeMode='contain'
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h16 border border-secondary rounded-lg justify-center items-center">
              <Image 
                source={{ uri: user?.avatar }}
                resizeMode='cover'
                className="w-12 h-12 rounded-lg"
              />
            </View>
            <InfoBox 
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox 
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox 
                title="1.4k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title = "No Videos Found"
            subtitle = "No Videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Profile