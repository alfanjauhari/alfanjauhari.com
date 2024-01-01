package helpers

func Check(err error) {
	if err != nil {
		panic(err)
	}
}
