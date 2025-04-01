import React from 'react';
import { Container } from '@mui/material';
import ResumeAnalyzer from '../components/ResumeAnalyzer/ResumeAnalyzer';

export default function ResumeAnalysisPage() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <ResumeAnalyzer />
        </Container>
    );
}