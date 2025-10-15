import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");
  const currentYear = new Date().getFullYear();

  // Parse year, default to current year
  const year = yearParam ? parseInt(yearParam) : currentYear;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const username = "BimaWijaya69";

  if (!GITHUB_TOKEN) {
    console.error(
      "Error: GITHUB_TOKEN tidak ditemukan di environment variables."
    );
    return NextResponse.json(
      { message: "Konfigurasi server tidak valid." },
      { status: 500 }
    );
  }

  // === PERUBAHAN LOGIKA DIMULAI DI SINI ===

  const from = `${year}-01-01T00:00:00Z`;
  let to: string;

  if (year === currentYear) {
    // Jika tahun yang dipilih adalah tahun ini, batasi tanggal 'to' sampai hari ini.
    to = new Date().toISOString();
  } else if (year > currentYear) {
    // Mencegah request untuk tahun masa depan, kembalikan data kosong.
    to = from;
  } else {
    // Jika ini tahun lampau, ambil seluruh data sampai akhir tahun.
    to = `${year}-12-31T23:59:59Z`;
  }

  // === PERUBAHAN LOGIKA SELESAI ===

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              name
              owner {
                login
              }
            }
            contributions {
              totalCount
            }
          }
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username, from, to },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GitHub API request failed: ${response.status}`, errorBody);
      return NextResponse.json(
        {
          message: `Gagal mengambil data dari GitHub. Status: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
      return NextResponse.json(
        { message: data.errors[0].message || "Terjadi error pada GraphQL." },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Terjadi kesalahan pada API route:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
