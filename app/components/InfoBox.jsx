import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-pmsemibold ${titleStyles}`}>{title}</Text>
      <Text className="font-pregular text-sm text-gray-100 text-center">{subtitle}</Text>
    </View>
  )
}

export default InfoBox