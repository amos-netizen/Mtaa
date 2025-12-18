#!/bin/bash

# Email Service Configuration Script
# This script helps you configure the email service for MTAA

echo "📧 MTAA Email Service Configuration"
echo "===================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env .env.local 2>/dev/null || echo "Please create .env.local first"
fi

echo "Choose your email provider:"
echo "1) SendGrid (Recommended for Production)"
echo "2) Mailgun (Alternative Production)"
echo "3) SMTP (Gmail/Outlook/Custom)"
echo "4) None (Development - emails logged only)"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "📝 SendGrid Configuration"
        echo "1. Sign up at: https://signup.sendgrid.com/"
        echo "2. Create API Key at: Settings → API Keys"
        echo "3. Copy your API key (starts with SG.)"
        echo ""
        read -p "Enter SendGrid API Key: " api_key
        read -p "Enter FROM email address (e.g., noreply@mymtaa.com): " from_email
        
        # Update .env.local
        sed -i '/^EMAIL_SERVICE=/d' .env.local
        sed -i '/^EMAIL_SERVICE_API_KEY=/d' .env.local
        sed -i '/^EMAIL_FROM_ADDRESS=/d' .env.local
        
        echo "" >> .env.local
        echo "# Email Service Configuration (SendGrid)" >> .env.local
        echo "EMAIL_SERVICE=sendgrid" >> .env.local
        echo "EMAIL_SERVICE_API_KEY=$api_key" >> .env.local
        echo "EMAIL_FROM_ADDRESS=$from_email" >> .env.local
        
        echo ""
        echo "✅ SendGrid configured!"
        ;;
    2)
        echo ""
        echo "📝 Mailgun Configuration"
        echo "1. Sign up at: https://signup.mailgun.com/"
        echo "2. Get API Key from: Sending → API Keys"
        echo "3. Get Domain from: Sending → Domains"
        echo ""
        read -p "Enter Mailgun API Key: " api_key
        read -p "Enter Mailgun Domain (e.g., mg.mymtaa.com): " domain
        read -p "Enter FROM email address (e.g., noreply@mg.mymtaa.com): " from_email
        
        # Update .env.local
        sed -i '/^EMAIL_SERVICE=/d' .env.local
        sed -i '/^EMAIL_SERVICE_API_KEY=/d' .env.local
        sed -i '/^MAILGUN_DOMAIN=/d' .env.local
        sed -i '/^EMAIL_FROM_ADDRESS=/d' .env.local
        
        echo "" >> .env.local
        echo "# Email Service Configuration (Mailgun)" >> .env.local
        echo "EMAIL_SERVICE=mailgun" >> .env.local
        echo "EMAIL_SERVICE_API_KEY=$api_key" >> .env.local
        echo "MAILGUN_DOMAIN=$domain" >> .env.local
        echo "EMAIL_FROM_ADDRESS=$from_email" >> .env.local
        
        echo ""
        echo "✅ Mailgun configured!"
        ;;
    3)
        echo ""
        echo "📝 SMTP Configuration"
        echo ""
        read -p "Enter SMTP Host (e.g., smtp.gmail.com): " smtp_host
        read -p "Enter SMTP Port (587 for TLS, 465 for SSL): " smtp_port
        read -p "Enter SMTP Username: " smtp_user
        read -p "Enter SMTP Password: " smtp_password
        read -p "Is connection secure? (true/false) [false]: " smtp_secure
        smtp_secure=${smtp_secure:-false}
        read -p "Enter FROM email address: " from_email
        
        # Update .env.local
        sed -i '/^EMAIL_SERVICE=/d' .env.local
        sed -i '/^SMTP_HOST=/d' .env.local
        sed -i '/^SMTP_PORT=/d' .env.local
        sed -i '/^SMTP_USER=/d' .env.local
        sed -i '/^SMTP_PASSWORD=/d' .env.local
        sed -i '/^SMTP_SECURE=/d' .env.local
        sed -i '/^EMAIL_FROM_ADDRESS=/d' .env.local
        
        echo "" >> .env.local
        echo "# Email Service Configuration (SMTP)" >> .env.local
        echo "EMAIL_SERVICE=smtp" >> .env.local
        echo "SMTP_HOST=$smtp_host" >> .env.local
        echo "SMTP_PORT=$smtp_port" >> .env.local
        echo "SMTP_USER=$smtp_user" >> .env.local
        echo "SMTP_PASSWORD=$smtp_password" >> .env.local
        echo "SMTP_SECURE=$smtp_secure" >> .env.local
        echo "EMAIL_FROM_ADDRESS=$from_email" >> .env.local
        
        echo ""
        echo "✅ SMTP configured!"
        ;;
    4)
        echo ""
        echo "📝 Setting email service to 'none' (development mode)"
        
        # Update .env.local
        sed -i '/^EMAIL_SERVICE=/d' .env.local
        sed -i '/^EMAIL_FROM_ADDRESS=/d' .env.local
        
        echo "" >> .env.local
        echo "# Email Service Configuration (Disabled)" >> .env.local
        echo "EMAIL_SERVICE=none" >> .env.local
        echo "EMAIL_FROM_ADDRESS=noreply@mymtaa.com" >> .env.local
        
        echo ""
        echo "✅ Email service disabled (emails will be logged only)"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📋 Configuration Summary:"
echo "=========================="
grep -E "^EMAIL_|^SMTP_|^MAILGUN_" .env.local | grep -v "^#"
echo ""
echo "🔄 Restart your backend server to apply changes:"
echo "   npm run dev"
echo ""

