using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Web.Security;

public partial class Login : Page
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
            
            // Yönlendirme parametresi varsa işle
            string returnUrl = Request.QueryString["ReturnUrl"];
            if (!string.IsNullOrEmpty(returnUrl))
            {
                // Yönlendirme URL'ini session'da sakla
                Session["ReturnUrl"] = returnUrl;
            }
        }
    }

    protected void btnLogin_Click(object sender, EventArgs e)
    {
        try
        {
            // Form verilerini al
            string email = txtEmail.Text.Trim();
            string password = txtPassword.Text;
            bool rememberMe = chkRememberMe.Checked;
            
            // Kullanıcı bilgilerini doğrula
            if (ValidateUser(email, password))
            {
                // Kullanıcı bilgileri doğru
                
                // Gerçek uygulamada kullanıcı bilgilerini veritabanından almalısınız
                // Şimdilik test için sabit değerler
                int userId = 101; // Örnek kullanıcı ID
                string userName = "Mehmet Yılmaz"; // Örnek kullanıcı adı
                bool isAdmin = false; // Örnek admin durumu
                
                // Session bilgilerini ayarla
                Session["UserID"] = userId;
                Session["UserName"] = userName;
                Session["Email"] = email;
                Session["IsAdmin"] = isAdmin;
                
                // Beni hatırla seçeneği işaretlenmişse cookie oluştur
                if (rememberMe)
                {
                    // 30 günlük kalıcı cookie oluştur
                    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(
                        1, 
                        email, 
                        DateTime.Now, 
                        DateTime.Now.AddDays(30),
                        true,
                        userId.ToString(),
                        FormsAuthentication.FormsCookiePath
                    );
                    
                    // Cookie'yi şifrele ve gönder
                    string encryptedTicket = FormsAuthentication.Encrypt(ticket);
                    HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
                    cookie.Expires = ticket.Expiration;
                    cookie.Path = FormsAuthentication.FormsCookiePath;
                    Response.Cookies.Add(cookie);
                }
                
                // Kullanıcıyı yönlendir
                if (Session["ReturnUrl"] != null)
                {
                    // İstek yapılan sayfaya geri dön
                    string returnUrl = Session["ReturnUrl"].ToString();
                    Session.Remove("ReturnUrl");
                    Response.Redirect(returnUrl);
                }
                else
                {
                    // Ana sayfaya yönlendir
                    Response.Redirect("~/Default.aspx");
                }
            }
            else
            {
                // Kullanıcı bilgileri hatalı
                ShowError("E-posta adresi veya şifre hatalı. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.");
            }
        }
        catch (Exception ex)
        {
            // Hata mesajını göster
            ShowError("Giriş yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
            
            // Hata loglanabilir
            System.Diagnostics.Debug.WriteLine("Login hatası: " + ex.Message);
        }
    }
    
    private bool ValidateUser(string email, string password)
    {
        // Bu metod gerçek bir veritabanı bağlantısı ile değiştirilecek
        // Şu anda simüle edilmiş bir doğrulama işlemi var
        
        // Simüle edilmiş test kullanıcıları
        Dictionary<string, string> testUsers = new Dictionary<string, string>
        {
            { "admin@senirkentblog.com", "admin123" },
            { "mehmet@example.com", "mehmet123" },
            { "ayse@example.com", "ayse123" }
        };
        
        // Kullanıcı e-posta ve şifre kontrolü
        if (testUsers.ContainsKey(email))
        {
            return testUsers[email] == password;
        }
        
        return false;
        
        // Örnek SQL sorgusu (veritabanı bağlantısı eklendiğinde bu kullanılabilir):
        // string connectionString = ConfigurationManager.ConnectionStrings["SenirkentBlogDB"].ConnectionString;
        // using (SqlConnection conn = new SqlConnection(connectionString))
        // {
        //     SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Users WHERE Email = @Email AND Password = @Password", conn);
        //     cmd.Parameters.AddWithValue("@Email", email);
        //     cmd.Parameters.AddWithValue("@Password", HashPassword(password)); // Gerçek uygulamada şifreleri hash'lemelisiniz
        //     
        //     conn.Open();
        //     int count = (int)cmd.ExecuteScalar();
        //     
        //     return count > 0;
        // }
    }
    
    private void ShowError(string message)
    {
        litErrorMessage.Text = message;
        pnlLoginError.Visible = true;
    }
}
