export const isUserId = new RegExp(/^[a-z0-9_-]{3,32}$/g);
export const isEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
export const isPassword = new RegExp(/^(?=.*[A-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+{}|;':"<>,./?])[a-zA-Z0-9~!@#$%^&*()_+{}|;':"<>,./?]{5,40}$/g);
