import { jwtDecode } from "jwt-decode";

export const verifyToken = (token) => {
    try {
        return jwtDecode(token); // কোনো <CustomJwtPayload> দরকার নেই
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};
