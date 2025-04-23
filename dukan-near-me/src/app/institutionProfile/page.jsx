import Navbar from '@/app/components/InstitutionHome/navbar/Navbar';
import About from '@/app/components/InstitutionHome/Profile/About';
import HeroSection from '@/app/components/InstitutionHome/Profile/HeroSection';
import Review from '@/app/components/InstitutionHome/Profile/Review';
import ProfileWrapper from '@/app/components/InstitutionHome/Profile/ProfileWrapper';

export default function page() {
    
    return (
        <>
            <Navbar />
            <ProfileWrapper >
                <HeroSection />
                <About />
            </ProfileWrapper>
            <Review />

        </>
    );
}
