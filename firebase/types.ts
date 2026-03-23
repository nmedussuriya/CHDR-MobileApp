// Role interface
export interface role {
    role_id: string;
    role_name: string;
}

// User interface
export interface user {
    user_id: string;
    username: string;
    email: string;
    password: string;
    role_id: string;      // ← This defines role_id
    contact_number?: string;
}

// Staff interface
export interface staff {
    staff_id: string;
    regestration_number: string;
    assigned_area_id: string;
    user_id: string;
    name?: string;        // Optional: add name field
    role_id?: string;     // ← Add this if you want role_id in staff
}

// Parent interface
export interface parent {
    parent_id: string;
    parent_name: string;
    contact_number: string;
    user_id: string;
}

// Child interface - ADD MIDWIFE_ID HERE
export interface child {
    child_id: string;
    child_name: string;
    dob: string;
    gender: "Male" | "Female";
    birth_weight: number;
    head_circumference: number;
    length_at_birth: number;
    address: string;
    parent_id: string;
    midwife_id: string;   // ← ADD THIS
}

export interface vaccine{
    vaccine_id: string;
    vaccine_name: string;
    Age_group: string;
}

export interface ImmunizationRecord{
    immune_id: string;
    date_administered: string;
    batch_no: string;
    status: "Pending" | "Completed";
    notes: string;
    child_id: string;
    vaccine_id: string;
}


export interface FollowUpRecord{
    followup_id: string;
    period: string;
    weight: number;
    eye_condition: string;
    skin_color: string;
    feeding: string;
    head_circumference: number;
    reflexes: string;
    child_id: string;
}

export interface DevelopmentMilestone{
    development_id: string;
    milestone_name: string;
    age_group: string;
}

export interface ChildDevelopmentRecord{
    record_id: string;
    reported_month:string;
    confirmed_month:string;
    confirmed_by: string;
    notes:string;
    development_id:string;
    child_id:string;
}

export interface screening_type{
    type_id:string;
    type_name:string;
}

export interface screening_question{
    question_id:string;
    question_text:string;
    type_id:string;
}

export interface screening_response{
    response_id:string;
    answer: "Yes" | "No";
    date_checked: string;
    question_id:string;
    child_id: string;
}

