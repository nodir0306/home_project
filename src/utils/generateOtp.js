import OtpGenerator from "otp-generator";

const generateRandomOTP = () => {
  return OtpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
  });
};

export default generateRandomOTP;
