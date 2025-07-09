import type { ProjectInput } from "../components/CreateProject"
import type { loginType, RegistrationType } from "../Pages/Login/Login";

export const handleProjectValidate = (projectData: ProjectInput) => {
    const newErrors: { [key: string]: string } = {};

    console.log("projectData", projectData)
    if (!projectData.projectName?.trim()) {
        newErrors.projectName = "project name is required"
    }

    if (!projectData.startDate) {
        newErrors.startDate = "start date is required"
    }

    if (!projectData.dueDate) {
        newErrors.dueDate = "Due date is Required"
    }

    if (projectData.startDate && projectData.endDate && projectData.endDate <= projectData.startDate) {
        newErrors.endDate = "End date must be after start date.";
    }

    if (projectData.startDate && projectData.dueDate && projectData.dueDate <= projectData.startDate) {
        newErrors.endDate = "Due date must be after start date.";
    }

    return newErrors;
}



export const handleLoginValidation = (loginData: loginType) => {
    const newErrors: { [key: string]: string } = {};



    // Email validation
    if (!loginData.email?.trim()) {
        newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(loginData.email)) {
        newErrors.email = "Enter a valid email address";
    }

    // const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$/;

    // Password validation
    if (!loginData.password) {
        newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
    }
    //  else if (!passwordRegex.test(loginData.password)) {
    //     newErrors.password = "Password is not strong enough";
    // }




    return newErrors;
};



export const handleRegistrationValidation = (registerData: RegistrationType) => {
    const newErrors: { [key: string]: string } = {};



    // Email validation
    if (!registerData.email?.trim()) {
        newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
        newErrors.email = "Enter a valid email address";
    }

    // const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$/;

    // Password validation
    if (!registerData.password) {
        newErrors.password = "Password is required";
    } else if (registerData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
    } 
    // else if (!passwordRegex.test(registerData.password)) {
    //     newErrors.password = "Password is not strong enough";
    // }

    if (!registerData.userName) {
        newErrors.userName = "user name is not provided"
    }

    if (!registerData.phoneNo) {
        newErrors.phoneNo = "phone Number is required";
    }
    if (!/^\d{10}$/.test(registerData.phoneNo.trim())) {
        newErrors.phoneNo = "Phone number should contain exactly 10 digits"
    }


    if (!registerData.confirmPassword.trim()) {
        newErrors.confirmPassword = "please confirm your password"
    } else if (registerData.password !== registerData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
    }


    return newErrors;
};