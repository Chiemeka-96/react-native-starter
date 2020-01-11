import * as React from 'react';
import { useState, useCallback, useEffect } from 'react'
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ImageBackground,
  Alert
} from 'react-native'
import {withTheme, Avatar, Text, Switch} from 'react-native-paper'
import {scale} from 'react-native-size-matters'
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from 'utils'
import {SectionItem, SectionHeader} from './sections'


type Props = {
  theme: {colors?: any, dark?: any}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {

    // marginBottom: scale(10),
  },
  imageBgContainer: {
    top: scale(1),
    paddingLeft: scale(15),
    height: 'auto'
  },
  avatarContainer: {
    marginTop: scale(10),
    marginBottom: scale(10)
  },
  userCred: {
    marginBottom: scale(10),
  },
  username: {
    fontWeight: '500', 
    fontSize: scale(20),
    color: '#fff'
  },
  useremail: {
    color: '#fff'
  }
});

const menuItems = [
  { label: "Profile", icon: "person", key: 0, route: 'Profile' },
  { label: "Payment", icon: "dollar", key: 1, route: 'Payment' },
  { label: "Settings and Privacy", icon: "spinner-cog", key: 2, route: 'Settings' }
];

export const CustomDrawerComponent: React.FC<Props | any> = props => {
  
  useEffect(() => {
    // use an IIFE
    (async function runAuth() {
      try {
        // await auth().signInAnonymously();
      } catch (e) {
        switch (e.code) {
          case 'auth/operation-not-allowed':
            console.log('Enable anonymous in your firebase console.');
            break;
          default:
            console.error(e);
            break;
        }
      }
    })()
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
          <ProfileSection
              {...props}
              // avatarBackground={avatarBackground}
              // onPress={() => this.profileModal.open()} //* deprecated for now for time sake. Will work on it after release
              onPress={() => props.navigation.navigate("Home")}
            />
          <MemoizedMenuSection {...props} />
      </ScrollView>
    </SafeAreaView>
  )
};

export const ProfileSection: React.FC<Props | any> = (props) => {
  const {
    navigation,
    theme: { colors },
    // avatarBackground,
    onPress,
    avatar=null,
    userName='James Ndika',
    userEmail='admin@eventsmag.com'
  } = props;

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={styles.profileContainer}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={{ uri: images.photo_bg }}
          style={styles.imageBgContainer}
        >
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={scale(60)}
              source={{ uri: avatar? avatar : images.profile_photo }}
            />
          </View>
          <View style={styles.userCred}>
            <Text style={styles.username}>{userName}</Text>
            <Text style={styles.useremail}>{userEmail}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const SwitchComponent = (props: any) => {
  const [isSwitchOn, setIsSwitchOn] = useState<boolean|any>(false)
  // console.log('switch component props', props)
  useEffect(() => {
    console.log('am re-rendered')
    setIsSwitchOn(props.dark)
  }, [])
  
  const valueChanged = useCallback(
    async (value) => {
      props.toggleTheme();
      setIsSwitchOn(value);
    },
    [isSwitchOn]
  )
  
  return (
    <Switch
      {...props}
      value={isSwitchOn}
      onValueChange={valueChanged}
      style={{marginTop: 5, marginRight: 10}}
    />
  )
}

export const MenuSection: React.FC<Props|any> = (props) => {
  const [drawerIndex, setDrawerIndex] = useState<number|any>(null)
  const {
    navigation,
    theme: { dark, colors },
    toggleTheme,
  } = props;

  const _setDrawerItem = useCallback(
    (index: number, route = null) => {
      setDrawerIndex(index);
      if (route) {
        navigation.navigate(route);
      }
    }, []
  );

  return (
    <View>
      <SectionHeader {...props} title="Menu" />
      {menuItems.map((props, index) => (
        <SectionItem
          {...props}
          key={props.key}
          onPress={() => _setDrawerItem(index, props.route)}
          iconColor={colors.text}
          iconLeft={props.icon}
          label={props.label}
          labelStyle={[
            {
              fontWeight: props.key === drawerIndex ? "bold" : "normal"
            }
          ]}
        />
      ))}
      <SectionItem
        label={dark ? "Dark Mode" : "Dark Mode"}
        onPress={toggleTheme}
        iconLeft={dark? "night-clear": 'day-sunny'}
        iconColor={colors.text}
        labelStyle={[
          {
            color: colors.text,
            fontStyle: "italic"
          }
        ]}
      />
    </View>
  );
}

const MemoizedMenuSection = React.memo(MenuSection)

export default withTheme(CustomDrawerComponent)