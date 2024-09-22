import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// PDF Document component
const MyDocument = ({ answers }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>User Answers:</Text>
        {answers.map((answer, index) => (
          <Text key={index}>{`Question ${index + 1}: ${answer}`}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

// Download button component
const DownloadPDF = ({ answers }) => (
  <PDFDownloadLink document={<MyDocument answers={answers} />} fileName="user_answers.pdf">
    {({ blob, url, loading, error }) =>
      loading ? 'Loading document...' : 'Download PDF'
    }
  </PDFDownloadLink>
);

export default DownloadPDF;
