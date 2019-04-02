
export const GET_SHOWMODAL = 'GET_SHOWMODAL';

export const getshowModal = (register,Otp,ProfileSetup) => ({
    type: GET_SHOWMODAL,
    register: register, 
    Otp : Otp,
    ProfileSetup:ProfileSetup
});