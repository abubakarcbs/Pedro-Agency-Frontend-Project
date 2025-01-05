import axios from 'axios';

export default async function handler(req: { method: string; body: { email: any; otp: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }) {
  if (req.method === 'POST') {
    const { email, otp } = req.body;

    try {
      // Send the OTP verification request to the backend (FastAPI)
      const response = await axios.post('http://your-backend-url/verify-otp', { email, otp });

      // Return the checkout URL
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(400).json({ message: 'Error verifying OTP or creating session' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
