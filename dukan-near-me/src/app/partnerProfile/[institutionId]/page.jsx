import Navbar from '@/app/components/InstitutionHome/navbar/Navbar';
import About from '@/app/components/InstitutionHome/Profile/About';
import HeroSection from '@/app/components/InstitutionHome/Profile/HeroSection';
import Review from '@/app/components/InstitutionHome/Profile/Review';
import ProfileWrapper from '@/app/components/InstitutionHome/Profile/ProfileWrapper';

export default async function Page({ params }) {
    const { institutionId } = await params;
    console.log(institutionId);                        

    return (
        <>
            <Navbar />
            <ProfileWrapper>
                <HeroSection id={institutionId} />
                <About profileUpdated={institutionId} />
            </ProfileWrapper>
            <Review />
        </>
    );
}
