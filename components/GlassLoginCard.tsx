import { Image, ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

type GlassLoginCardProps = {
  title: string;
  backgroundSource: ImageSourcePropType;
  iconSource: ImageSourcePropType;
  emailLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder?: string;
  buttonText: string;
  showForgotPassword?: boolean;
  onLogin?: () => void;
};

export default function GlassLoginCard({
  title,
  backgroundSource,
  iconSource,
  emailLabel,
  emailPlaceholder,
  passwordPlaceholder = "Enter your password",
  buttonText,
  showForgotPassword = false,
  onLogin,
}: GlassLoginCardProps) {
  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.glassBox}>
          <Image source={iconSource} style={styles.icon} />

          <Text style={styles.title}>{title}</Text>

          <View style={styles.inputField}>
            <Text style={styles.label}>{emailLabel}</Text>
            <CustomInput placeholder={emailPlaceholder} />
          </View>

          <View style={styles.inputField}>
            <Text style={styles.label}>Password</Text>
            <CustomInput
              placeholder={passwordPlaceholder}
              secureTextEntry
            />
            {showForgotPassword && (
              <TouchableOpacity>
                <Text style={styles.forgotLink}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          <CustomButton title={buttonText} onPress={onLogin ?? (() => {})} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(244,247,246,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  glassBox: {
    width: 350,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 30,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  icon: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  inputField: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    color: "#555",
    marginBottom: 5,
  },
  forgotLink: {
    textAlign: "right",
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
});