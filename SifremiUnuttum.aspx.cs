using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Net.Mail;
using System.Net;

public partial class SifremiUnuttum : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Sayfa ilk kez yüklendiğinde ek işlemler yapılabilir
        if (!IsPostBack)
        {
            // Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
            if (Session["UserID"] != null)
            {
                Response.Redirect("~/Default.aspx");
            }
        }
    }

    protected void btnResetPassword_Click(object sender, EventArgs e)
    {
        try
        {
            // Form verilerini al
            string email = txtEmail.Text.Trim();
            
            // E-posta adresi kontrolü
            if (!IsEmailRegistered(email))
            {
                // Bu e-posta adresi kayıtlı değil
                ShowError("Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.");
                return;
            }
            
            // Sıfırlama token'ı oluştur
            string resetToken = GenerateResetToken();
            
            // Token'ı veritabanına kaydet
            if (SaveResetToken(email, resetToken))
            {
                // Sıfırlama e-postası gönder
                if (SendResetEmail(email, resetToken))
                {
                    // Başarılı mesajını göster
                    pnlResetForm.Visible = false;
                    pnlResetSuccess.Visible = true;
                    litSuccessEmail.Text = email;
                }
                else
                {
                    // E-posta gönderme hatası
                    ShowError("Şifre sıfırlama e-postası gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
                }
            }
            else
            {
                // Token kayıt hatası
                ShowError("Şifre sıfırlama işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
            }
        }
        catch (Exception ex)
        {
            // Hata mesajını göster
            ShowError("İşlem sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
            
            // Hata loglanabilir
            System.Diagnostics.Debug.WriteLine("Şifre sıfırlama hatası: " + ex.Message);
        }
    }
    
    private bool IsEmailRegistered(string email)
    {
        // Bu metod gerçek bir veritabanı bağlantısı ile değiştirilecek
        // Şu anda simüle edilmiş bir kontrol işlemi var
        
        // Simüle edilmiş kayıtlı e-posta adresleri
        List<string> registeredEmails = new List<string>
        {
            "admin@senirkentblog.com",
            "mehmet@example.com",
            "ayse@example.com"
        };
        
        return registeredEmails.Contains(email);
        
        // Örnek SQL sorgusu (veritabanı bağlantısı eklendiğinde bu kullanılabilir):
        // string connectionString = ConfigurationManager.ConnectionStrings["SenirkentBlogDB"].ConnectionString;
        // using (SqlConnection conn = new SqlConnection(connectionString))
        // {
        //     SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Users WHERE Email = @Email", conn);
        //     cmd.Parameters.AddWithValue("@Email", email);
        //     
        //     conn.Open();
        //     int count = (int)cmd.ExecuteScalar();
        //     
        //     return count > 0;
        // }
    }
    
    private string GenerateResetToken()
    {
        // Rastgele bir token oluştur
        return Guid.NewGuid().ToString("N");
    }
    
    private bool SaveResetToken(string email, string token)
    {
        // Bu metod gerçek bir veritabanı bağlantısı ile değiştirilecek
        // Şu anda simüle edilmiş bir kayıt işlemi var
        
        // Örnek SQL sorgusu (veritabanı bağlantısı eklendiğinde bu kullanılabilir):
        // string connectionString = ConfigurationManager.ConnectionStrings["SenirkentBlogDB"].ConnectionString;
        // using (SqlConnection conn = new SqlConnection(connectionString))
        // {
        //     SqlCommand cmd = new SqlCommand("INSERT INTO PasswordResets (Email, Token, ExpiryDate) VALUES (@Email, @Token, @ExpiryDate)", conn);
        //     cmd.Parameters.AddWithValue("@Email", email);
        //     cmd.Parameters.AddWithValue("@Token", token);
        //     cmd.Parameters.AddWithValue("@ExpiryDate", DateTime.Now.AddHours(24)); // 24 saat geçerli
        //     
        //     conn.Open();
        //     int result = cmd.ExecuteNonQuery();
        //     
        //     return result > 0;
        // }
        
        // Başarılı kayıt simülasyonu
        return true;
    }
    
    private bool SendResetEmail(string email, string token)
    {
        try
        {
            // Bu metod gerçek bir e-posta gönderme işlemi ile değiştirilecek
            // Şu anda simüle edilmiş bir e-posta gönderme işlemi var
            
            // Bu kısım gerçek uygulama için mail sunucusu ile değiştirilecek
            // string smtpServer = ConfigurationManager.AppSettings["SmtpServer"];
            // int smtpPort = Convert.ToInt32(ConfigurationManager.AppSettings["SmtpPort"]);
            // string smtpUsername = ConfigurationManager.AppSettings["SmtpUsername"];
            // string smtpPassword = ConfigurationManager.AppSettings["SmtpPassword"];
            // bool enableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["SmtpEnableSsl"]);
            // string fromEmail = ConfigurationManager.AppSettings["FromEmail"];
            // string fromName = ConfigurationManager.AppSettings["FromName"];
            
            // Sıfırlama bağlantısı
            string resetUrl = Request.Url.GetLeftPart(UriPartial.Authority) + ResolveUrl("~/SifreSifirla.aspx") + "?token=" + token;
            
            // E-posta içeriği
            string subject = "Senirkent Blog - Şifre Sıfırlama";
            string body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ text-align: center; margin-bottom: 20px; }}
                        .logo {{ max-width: 150px; }}
                        .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 5px; }}
                        .button {{ display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; margin: 20px 0; text-decoration: none; border-radius: 3px; }}
                        .footer {{ margin-top: 20px; font-size: 12px; color: #777; text-align: center; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <img src='https://senirkentblog.com/Images/logo.png' alt='Senirkent Blog Logo' class='logo'>
                            <h2>Şifre Sıfırlama İsteği</h2>
                        </div>
                        <div class='content'>
                            <p>Merhaba,</p>
                            <p>Hesabınız için bir şifre sıfırlama isteği aldık. Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
                            <a href='{resetUrl}' class='button'>Şifremi Sıfırla</a>
                            <p>Bu bağlantı 24 saat içinde geçerliliğini yitirecektir.</p>
                            <p>Eğer şifre sıfırlama isteğinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                        </div>
                        <div class='footer'>
                            <p>Bu e-posta Senirkent Blog tarafından gönderilmiştir. Lütfen bu e-postayı yanıtlamayın.</p>
                            <p>&copy; {DateTime.Now.Year} Senirkent Blog. Tüm hakları saklıdır.</p>
                        </div>
                    </div>
                </body>
                </html>";
                
            // Gerçek uygulamada e-posta gönderme kodu:
            // using (SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort))
            // {
            //     smtpClient.EnableSsl = enableSsl;
            //     smtpClient.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
            //     
            //     using (MailMessage mailMessage = new MailMessage())
            //     {
            //         mailMessage.From = new MailAddress(fromEmail, fromName);
            //         mailMessage.To.Add(email);
            //         mailMessage.Subject = subject;
            //         mailMessage.Body = body;
            //         mailMessage.IsBodyHtml = true;
            //         
            //         smtpClient.Send(mailMessage);
            //     }
            // }
            
            // Başarılı gönderim simülasyonu
            return true;
        }
        catch (Exception ex)
        {
            // Hata loglanabilir
            System.Diagnostics.Debug.WriteLine("E-posta gönderme hatası: " + ex.Message);
            return false;
        }
    }
    
    private void ShowError(string message)
    {
        litErrorMessage.Text = message;
        pnlResetError.Visible = true;
    }
}
