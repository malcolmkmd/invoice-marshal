# Invoice Marshal

Invoice Marshal is a web application designed to simplify the process of creating, managing, and sending invoices. Tailored for freelancers and small businesses, it combines intuitive design with powerful features for efficient invoice management.

---

## Key Features

- **Authentication**: Secure passwordless login using Magic Links.
- **Invoice Management**: Easily create, update, and generate professional PDF invoices.
- **Automated Email Notifications**:
  - Send invoices and updates with PDF attachments.
  - Automate overdue payment reminders with no-code tools.
- **Custom Styling**: Responsive and attractive UI built with ShadCN UI and TailwindCSS.
- **Database Integration**: Reliable data storage with PostgreSQL and Prisma ORM.

---

## Technology Stack

### Frontend

- **Next.js**: Modern React framework for scalable web applications.
- **Styling**:
  - **ShadCN UI**: Customizable, pre-styled UI components.
  - **TailwindCSS**: Utility-first CSS framework for quick and consistent design.

### Authentication

- **AuthJS**: Streamlined authentication handling.
- **Magic Links**: Hassle-free passwordless login experience.

### Email Services

- **Mailtrap**:
  - Seamless email handling with Nodemailer.
  - Attach PDFs to emails for invoices and updates.
  - Automate email workflows, including overdue reminders.

### PDF Generation

- **JSPDF**: Programmatically generate professional PDF invoices.

### Backend

- **PostgreSQL**: Scalable and robust relational database.
- **Prisma**: Advanced ORM offering type-safe database access.

---

## Installation Guide

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- PostgreSQL

### Setup Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/malcolmkmd/invoice-marshal.git
   cd invoice-marshal
   ```

2. **Install Dependencies**:

   ```bash
   pnpm install
   ```

3. **Set Environment Variables**:
   Create a `.env` file in the root directory and add:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/invoice_marshal
   NEXTAUTH_SECRET=your-next-auth-secret
   NEXTAUTH_URL=http://localhost:3000
   MAILTRAP_USER=your-mailtrap-user
   MAILTRAP_PASS=your-mailtrap-password
   ```

4. **Run Migrations**:

   ```bash
   pnpm prisma migrate dev
   ```

5. **Start the Development Server**:
   ```bash
   pnpm dev
   ```
   Access the app at [http://localhost:3000](http://localhost:3000).

---

## How to Use

1. **Login**:

   - Authenticate using Magic Links sent to your email.

2. **Manage Invoices**:
   - Create, save, and generate PDF invoices.
   - Send invoices or updates directly via email.
   - Track overdue payments and notify clients.

---

## Development Workflow

- **Styling**:
  - Utilize TailwindCSS for fast UI design.
  - Customize components with ShadCN UI.
- **Database**:
  - Update Prisma schema as needed.
  - Apply changes with `pnpm prisma migrate`.
- **Email Testing**:
  - Use Mailtrap for testing email workflows.
- **PDF Customization**:
  - Modify templates using JSPDF for tailored invoice designs.

---

## Deployment Instructions

1. **Prepare for Production**:

   - Update `.env` variables with production values.

2. **Build and Deploy**:

   ```bash
   pnpm build
   pnpm start
   ```

3. **Deployment Platforms**:
   - Deploy easily on platforms like Vercel or Netlify.

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request for review.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

Thanks tJan Marshal (https://www.youtube.com/watch?v=AH3xlNuui_A)
