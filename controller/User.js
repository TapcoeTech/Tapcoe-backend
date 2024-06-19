export const createUser= async()=> {
    try {
        const user = new User({
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890'
        });
        await user.save();
        console.log('User created:', user);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}



