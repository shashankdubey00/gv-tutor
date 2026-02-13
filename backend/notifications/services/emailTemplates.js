class EmailTemplates {
    newJobEmail({ tutorName, jobTitle, subject, location, budget, jobId, jobDetails }) {
        const appBaseUrl = (process.env.CLIENT_URL || process.env.APP_URL || "").replace(/\/$/, "");
        const applyUrl = `${appBaseUrl}/apply-tutor?requestId=${encodeURIComponent(jobId)}`;
        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
        .job-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #4CAF50; }
        .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 New Tutoring Opportunity!</h1>
        </div>
        <div class="content">
            <p>Hi ${tutorName || 'there'},</p>
            <p>A new tutoring job has been posted!</p>
            
            <div class="job-details">
                <h2 style="margin-top: 0; color: #4CAF50;">${jobTitle}</h2>
                <div><strong>📚 Subject:</strong> ${subject}</div>
                <div><strong>📍 Location:</strong> ${location}</div>
                <div><strong>💰 Budget:</strong> ₹${budget}/month</div>
                <div><strong>📝 Details:</strong> ${jobDetails}</div>
            </div>
            
            <center>
                <a href="${applyUrl}" class="button">
                    View Full Details & Apply
                </a>
            </center>
        </div>
    </div>
</body>
</html>
        `;

        return {
            subject: `New Job: ${jobTitle} - ${subject}`,
            html: html
        };
    }

    announcementEmail({ tutorName, title, message, imageUrl = null }) {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
        .image { max-width: 100%; height: auto; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📢 ${title}</h1>
        </div>
        <div class="content">
            <p>Hi ${tutorName},</p>
            ${imageUrl ? `<img src="${imageUrl}" class="image" alt="Announcement">` : ''}
            <div>${message}</div>
        </div>
    </div>
</body>
</html>
        `;

        return {
            subject: title,
            html: html
        };
    }
}

export default new EmailTemplates();
