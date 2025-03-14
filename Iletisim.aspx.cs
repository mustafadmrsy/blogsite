using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Net.Mail;
using System.Net;

public partial class Iletisim : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Sayfa ilk kez yüklendiğinde ek işlemler yapılabilir
        if (!IsPostBack)
        {
            // Kod buraya eklenebilir
        }
    }

    protected void btnSubmit_Click(object sender, EventArgs e)
    {
        try
        {
            // Form verilerini al
            string name = txtName.Text.Trim();
            string email = txtEmail.Text.Trim();
            string subject = txtSubject.Text.Trim();
            string message = txtMessage.Text.Trim();
            
            // Veritabanına iletişim mesajını kaydet
            SaveContactMessage(name, email, subject, message);
            
            // Doğrudan e-posta göndermek için sistem hazır değilse, 
            // veritabanına kaydetme işlemi yapılabilir
            // SendEmail(name, email, subject, message);
            
            // Başarı mesajını göster
            pnlSuccess.Visible = true;
            pnlError.Visible = false;
            
            // Formu temizle
            ClearForm();
        }
        catch (Exception ex)
        {
            // Hata mesajını göster
            pnlError.Visible = true;
            pnlSuccess.Visible = false;
            litErrorMessage.Text = "Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.";
            
            // Hata loglanabilir
            System.Diagnostics.Debug.WriteLine("İletişim formu gönderilirken hata: " + ex.Message);
        }
    }
    
    private void SaveContactMessage(string name, string email, string subject, string message)
    {
        // Bu metod gerçek bir veritabanı bağlantısı ile değiştirilecek
        // Şu anda simüle edilmiş bir kayıt işlemi var
        
        // Örnek SQL sorgusu:
        // string connectionString = ConfigurationManager.ConnectionStrings["SenirkentBlogDB"].ConnectionString;
        // using (SqlConnection conn = new SqlConnection(connectionString))
        // {
        //     SqlCommand cmd = new SqlCommand("INSERT INTO ContactMessages (Name, Email, Subject, Message, ReceivedDate, IsRead) VALUES (@Name, @Email, @Subject, @Message, @ReceivedDate, @IsRead)", conn);
        //     cmd.Parameters.AddWithValue("@Name", name);
        //     cmd.Parameters.AddWithValue("@Email", email);
        //     cmd.Parameters.AddWithValue("@Subject", subject);
        //     cmd.Parameters.AddWithValue("@Message", message);
        //     cmd.Parameters.AddWithValue("@ReceivedDate", DateTime.Now);
        //     cmd.Parameters.AddWithValue("@IsRead", false);
        //     
        //     conn.Open();
        //     cmd.ExecuteNonQuery();
        // }
        
        // Loglama için
        System.Diagnostics.Debug.WriteLine($"İletişim mesajı kaydedildi: {name}, {email}, {subject}");
    }
    
    private void SendEmail(string name, string email, string subject, string message)
    {
        // Bu metod bir SMTP sunucu yapılandırması gerektirir
        // Şu anda simüle edilmiş bir e-posta gönderme işlemi var
        
        // Örnek SMTP kodu:
        // string smtpHost = ConfigurationManager.AppSettings["SmtpHost"];
        // int smtpPort = Convert.ToInt32(ConfigurationManager.AppSettings["SmtpPort"]);
        // string smtpUsername = ConfigurationManager.AppSettings["SmtpUsername"];
        // string smtpPassword = ConfigurationManager.AppSettings["SmtpPassword"];
        // string toEmail = ConfigurationManager.AppSettings["ContactEmail"];
        // 
        // using (SmtpClient client = new SmtpClient(smtpHost, smtpPort))
        // {
        //     client.EnableSsl = true;
        //     client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
        //     
        //     using (MailMessage mailMessage = new MailMessage())
        //     {
        //         mailMessage.From = new MailAddress(email, name);
        //         mailMessage.To.Add(toEmail);
        //         mailMessage.Subject = "İletişim Formu: " + subject;
        //         mailMessage.Body = $"Gönderen: {name} ({email})\n\nMesaj:\n{message}";
        //         
        //         client.Send(mailMessage);
        //     }
        // }
        
        // Loglama için
        System.Diagnostics.Debug.WriteLine($"E-posta gönderildi: {name}, {email}, {subject}");
    }
    
    private void ClearForm()
    {
        // Form alanlarını temizle
        txtName.Text = string.Empty;
        txtEmail.Text = string.Empty;
        txtSubject.Text = string.Empty;
        txtMessage.Text = string.Empty;
    }
}
