type SurveyImage = {
  id: number,
  image: string,
  created_at: Date
}

type Survey = {
  id: number,
  rating: number,
  comment: string,
  email: string,
  created_at: Date,
  updated_at: Date,
  bus: number,
  images: SurveyImage[]
}

export default Survey;